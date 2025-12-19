import asyncHandler from "../Utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import apiError from "../Utils/errorHandler.js"
import Admin from "../Models/admin.model.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Get the header from req
    const authHeader = req.headers.authorization;

    // verify the header
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new apiError(401, "Not Authenticated: No Token Provided");
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    try {
        // verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find user in DB
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

        if (!admin) {
            throw new apiError(404, "Admin not found");
        }

        // Attach the admin to request
        req.admin = admin;
        next();
    } catch (error) {
        throw new apiError(401, "Invalid or Expired Token")
    }
})