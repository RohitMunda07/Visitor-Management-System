import { asyncHandler } from "../Utils/asyncHandler.js"
import apiResponse from "../Utils/apiResponse.js"
import apiError from "../Utils/errorHandler.js"
import User from "../Models/user.model.js"

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

    // Validating other fields
    if (!Array.isArray(req.body)) {
        let data = req.body;

        if (typeof (data) === 'object' && data != null) {
            Object.entries(data).forEach(([key, value]) => {
                const field = value ?? '';
                if (field === '' || (typeof field === 'string' && field.trim() === '')) {
                    throw new apiError(400, `${key} is Missing`)
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

export {
    registerUser,
    loginUser,
    logoutUser
}