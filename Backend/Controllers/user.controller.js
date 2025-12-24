import { asyncHandler } from "../Utils/asyncHandler.js"
import apiResponse from "../Utils/apiResponse.js"
import apiError from "../Utils/errorHandler.js"
import User from "../Models/user.model.js"
import jwt from "jsonwebtoken"

// Generate Access and Refresh Token
const generateAccessAndRefreshToken = async (id) => {
    if (!id) return;

    try {
        // find the user in DB
        const user = await User.findById(id)
        if (!user) {
            throw new apiError(404, "User Not Found")
        }

        // generate tokens
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();

        // assign the token to user
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { refreshToken, accessToken }
    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh token")
    }
}

// Register User 
const registerUser = asyncHandler(async (req, res) => {
    const {
        fullName,
        phoneNumber,
        email,
        password,
        role,
        aadharDetail
    } = req.body;

    // phone number validation
    const indianPhoneRegex = /^(?:[6-9]\d{9}|0\d{2,4}[- ]?\d{6,8})$/;
    const phoneStr = phoneNumber !== undefined && phoneNumber !== null ? String(phoneNumber).trim() : "";
    if (!phoneStr) {
        console.log("phone number from frontend:", (phoneNumber));
        console.log("Type of phone number", typeof (phoneNumber));
        throw new apiError(400, "Phone Number is either missing or invalid");
    }

    if (!indianPhoneRegex.test(phoneStr)) {
        throw new apiError(400, "Not an Indian Number");
    }

    // Aadhar Validation (same as visitor controller)
    const isValidAadhaar = (aadhaar) => {
        if (typeof aadhaar !== "string") return false;

        // Regex: 12 digits, first digit 2-9, optional spaces every 4 digits
        const aadhaarRegex = /^(?!0|1)\d{4}\s?\d{4}\s?\d{4}$/;

        return aadhaarRegex.test(aadhaar.trim());
    }

    if (!isValidAadhaar(aadharDetail)) {
        throw new apiError(400, "Invalid Aadhar Details")
    }

    // Validating other fields
    if (!Array.isArray(req.body)) {
        let data = req.body;

        if (typeof (data) === 'object' && data != null) {
            Object.entries(data).forEach(([key, value]) => {
                const field = value ?? '';
                if (field === '' || (typeof field === 'string' && field.trim() === '')) {
                    throw new apiError(400, `${key} is Missing`);
                }
            });

        } else {
            throw new apiError(400, "Expected an object")
        }
    }

    const user = await User.create({
        fullName,
        phoneNumber: phoneStr,
        email,
        password,
        role,
        aadharDetail
    })

    if (!user) {
        throw new apiError(500, "Something went wrong while creating user")
    }
    const newUser = await User.findById(user?._id)
        .select("-password -refreshToken")

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                newUser,
                "User Created Successfully"
            )
        )

})

// Login User
const loginUser = asyncHandler(async (req, res) => {
    const { role, password } = req.body;

    if (!role) {
        throw new apiError(400, "Role Field Missing");
    }

    if (!password || password.trim() === "") {
        throw new apiError(400, "Either Password Field Missing or Invalid Password")
    }

    const existingUser = await User.findOne({ role });
    if (!existingUser) {
        throw new apiError(404, "User Not Found")
    }

    // validate password
    const isPasswordValid = await existingUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(400, "Invalid Password");
    }

    // attach refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser?._id);
    const user = await User.findById(existingUser?._id)
        .select("-password -refreshToken");
    console.log(accessToken, refreshToken);


    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { user, accessToken, refreshToken },
                "User Logged In Successfully"
            )
        )

})

// Logout User 
const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new apiError(400, "User Not Logged In");
    }

    await User.findByIdAndUpdate(user?._id, {
        $unset: {
            refreshToken: 1
        }
    })

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "User Logout Successfully"
            )
        )
})

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { fullName, role } = req.body;
    const data = req.body;

    if (data === null || typeof data !== "object") {
        throw new apiError(400, "Expected an Object");
    }

    Object.entries(data).forEach(([key, value]) => {
        const field = value ?? '';
        if (field === '' || (typeof field === 'string' && field.trim() === '')) {
            throw new apiError(400, `${key} is Missing`);
        }
    })

    console.log("finding user ");

    const user = await User.findOne(
        { $and: [{ fullName }, { role }] }
    )

    console.log("user check");

    if (!user) {
        throw new apiError(404, "User Not Found");
    }

    await User.findOneAndDelete(
        { $and: [{ fullName }, { role }] }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                `Fullname ${fullName} Role ${role} Deleted Successfully`
            )
        )


})

// Update Access and Refresh Token
const updateAccessToken = asyncHandler(async (req, res) => {
    const incommingToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incommingToken) {
        throw new apiError(400, "Refresh Token is Missing Unauthorized Request")
    }

    // decode token to find user
    let decodedToken;
    try {
        decodedToken = jwt.verify(incommingToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new apiError(401, "Invalid or Expired Refresh Token");
    }

    // find user in DB using DecodedToken
    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new apiError(400, "Invalid Token to find user")
    }

    if (user.refreshToken !== incommingToken) {
        throw new apiError(400, "Refresh Token Expired");
    }

    const { refreshToken: newRefreshToken, accessToken } = await generateAccessAndRefreshToken(user?._id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new apiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access Token Updated Successfully"
            )
        )
})

// Update Password
const updatePassword = asyncHandler(async (req, res) => {
    const { fullName, role, newPassword } = req.body;

    fullName.toLowercase();
    role.toLowercase();

    const data = req.body;
    try {

        if (data === null || typeof data !== "object") {
            throw new apiError(400, "Expected an Object");
        }

        Object.entries(data).forEach(([key, value]) => {
            const field = value ?? '';
            if (field === '' || (typeof field === 'string' && field.trim() === '')) {
                throw new apiError(400, `${key} is Missing`);
            }
        })

        const user = await User.findOneAndUpdate(
            {
                $and: [{ fullName }, { role }]
            },
            {
                $set: {
                    password: newPassword
                }
            },
            {
                new: true
            }
        )
        return res
            .status(200)
            .json(
                new apiResponse(
                    200,
                    user,
                    "Password Updated Successfully"
                )
            )
    } catch (error) {
        throw new apiError(500, "Something went wrong while updating the password", error);
    }
})

// Get All Admin and Security 
const getAllAdminAndSecurity = asyncHandler(async (req, res) => {
    // Accept role via query to match pagination usage (GET requests)
    const { role } = req.query;
    const { page = 1, limit = 50 } = req.query;

    if (!role) {
        throw new apiError(400, "Role is required");
    }

    const pageNo = Math.min(1, Number(page));
    const pageSize = Math.max(50, Number(limit));
    const offSet = (pageNo - 1) * pageSize;

    const users = await User.find({ role })
        .select("-password -refreshToken")
        .skip(offSet)
        .limit(pageSize);

    if (users.length === 0) {
        throw new apiError(404, `No record found for ${role}`);
    }

    const totalDocs = await User.countDocuments({ role });
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevious = pageNo > 1;
    const hasNext = pageNo < totalPages;

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    users,
                    pagination: {
                        currentPage: pageNo,
                        dataPerPage: pageSize,
                        totalPages,
                        hasNext,
                        hasPrevious
                    }
                },
                "Record fetched successfully"
            )
        )

})

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)
        .select("-password");
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                user,
                "Fetched Current User Successfully"
            )
        )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    updateAccessToken,
    updatePassword,
    getAllAdminAndSecurity,
    getCurrentUser
}