import { asyncHandler } from "../Utils/asyncHandler.js";
import apiResponse from "../Utils/apiResponse.js";
import Visitor from "../Models/visitor.modle.js";
import apiError from "../Utils/errorHandler.js";
import { uploadOnCloudinary, delteFromCloudinary } from "../Utils/cloudinary.js"
import mongoose from "mongoose";
import { SORT_TYPE } from "../Utils/constant.js";

// Add Visitor Information to DB
const insertVisitor = asyncHandler(async (req, res) => {
    const {
        fullName,
        company,
        work,
        phoneNumber,
        aadharDetail,
        personToVisiting,
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

    // Validating fields
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

    // Aadhar Validation
    const isValidAadhaar = (aadhaar) => {
        if (typeof aadhaar !== "string") return false;

        // Regex: 12 digits, first digit 2-9, optional spaces every 4 digits
        const aadhaarRegex = /^(?!0|1)\d{4}\s?\d{4}\s?\d{4}$/;

        return aadhaarRegex.test(aadhaar.trim());
    }

    if (!isValidAadhaar(aadharDetail)) {
        throw new apiError(400, "Invalid Aadhar Details")
    }

    // Visitor's Imgae Validation
    const visitorImagePath = req.file?.path;

    if (!visitorImagePath) {
        throw new apiError(400, "Visitor Image is Missing")
    }

    let imageData = {};
    try {
        const res = await uploadOnCloudinary(visitorImagePath);
        if (res.secure_url) {
            imageData.imageURL = res.secure_url;
            imageData.publicId = res.public_id;
        }
    } catch (error) {
        throw new apiError(500, "Something went wrong while uploading image");
    }


    // create visitor's detail
    const visitor = await Visitor.create({
        fullName,
        company,
        work,
        phoneNumber: phoneStr,
        visitorImage: imageData,
        aadharDetail,
        personToVisiting
    })

    if (!visitor) {
        throw new apiError(500, "Something went wrong while creating visitor")
    }
    const newvisitor = await Visitor.findById(visitor?._id)

    return res
        .status(201)
        .json(
            new apiResponse(
                201,
                newvisitor,
                "visitor Inserted Successfully"
            )
        )

})

// Get All Visitors with filter
const getAllVisitors = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, sortType = "newest", status } = req.query;

    const pageNo = Math.min(1, Number(page));
    const pageSize = Math.max(50, Number(limit)); // page per content

    if (!Object.values(SORT_TYPE).includes(sortType)) {
        throw new apiError(400, "Invalid sort type")
    }

    const sortValue = SORT_TYPE.NEWEST === sortType ? 1 : -1;

    const offSet = (pageNo - 1) * pageSize;

    const allVisitors = await Visitor.find({})
        .skip(offSet)
        .limit(pageSize)
        .sort({ createdAt: sortValue })

    if (allVisitors.length === 0) {
        throw new apiError(404, "No Records Available");
    }

    const totalDocs = await Visitor.countDocuments({ status });
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevious = pageNo > 1;
    const hasNext = pageNo < totalPages;

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {
                    allVisitors,
                    pagination: {
                        currentPage: pageNo,
                        dataPerPage: pageSize,
                        totalPages,
                        hasNext,
                        hasPrevious
                    }
                },
                "Fetched All Visitors Successfully"
            )
        )
})

// Toggle Status
const toggleStatus = asyncHandler(async (req, res) => {
    const { visitorId } = req.params;

    if (!visitorId || !mongoose.Types.ObjectId.isValid(visitorId)) {
        throw new apiError(400, "Invalid Visitor Id");
    }

    const visitor = await Visitor.findByIdAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(visitorId)
        },
        {
            $set: {
                status: true
            }
        },
        {
            new: true,
        }
    )

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                visitor,
                "Request Approved Successfully"
            )
        )
})

// Search Visitor
const searchVisitor = asyncHandler(async (req, res) => {
    const { fullName } = req.query;

    if (!fullName?.trim()) {
        throw new apiError(400, "Fullname can't be empty");
    }

    const escapedName = fullName.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const visitors = await Visitor.find({
        fullName: { $regex: escapedName, $options: "i" }
    });

    if (!visitors.length) {
        throw new apiError(404, "Visitor Not Found");
    }

    return res.status(200).json(
        new apiResponse(200, visitors, "Visitors Fetched Successfully")
    );
});

// Delete Visitor
const deleteVisitor = asyncHandler(async (req, res) => {
    const { visitorArray } = req.body || [];
    const { visitorId } = req.params;

    if (visitorArray.length > 0) {
        // multiple visitor delete
        // Validate that VisitorArray is an array
        if (!Array.isArray(visitorArray) || !visitorArray.every(v => typeof v === 'object')) {
            throw new apiError(400, "visitorArray must be an array");
        }

        // ensure all deletions run and are awaited
        await Promise.all(visitorArray.map(async (v) => {
            if (v.publicId) {
                await delteFromCloudinary(v.publicId);
            }

            if (v._id && mongoose.Types.ObjectId.isValid(v._id)) {
                await Visitor.deleteOne({ _id: new mongoose.Types.ObjectId(v._id) });
            } else {
                await Visitor.deleteOne({ _id: v._id });
            }
        }));
    } else {
        // single visitor delete
        if (!visitorId || !mongoose.Types.ObjectId.isValid(visitorId)) {
            throw new apiError(400, "Invalid Visitor Id");
        }

        const existingVisitor = await Visitor.findOne({ _id: visitorId });

        if (!existingVisitor) {
            throw new apiError(
                404,
                "Visitor Not Found"
            )
        }
        const visitorPublicId = existingVisitor?.publicId;

        // delete image from cloudinary
        if (visitorPublicId) {
            await delteFromCloudinary(v.publicId);
        }

        // delete visitor from DB
        await Visitor.findByIdAndDelete(existingVisitor?._id);
    }


    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                {},
                "Visitors Deleted Successfully"
            )
        )
})


export {
    insertVisitor,
    getAllVisitors,
    toggleStatus,
    searchVisitor,
    deleteVisitor
}
