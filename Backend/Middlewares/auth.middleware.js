import { asyncHandler } from "../Utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import apiError from "../Utils/errorHandler.js"
import User from "../Models/user.model.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // Get the header from req
    const authHeader = req.headers.authorization;

    // verify the header
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new apiError(403, "Not Authenticated: No Token Provided");
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    // console.log("token extracted:", token);
    
    try {
        // verify token (should be access token for protected routes)
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // console.log("verified decodedToken for access token");
        } catch (err) {
            console.error('JWT verification error:', err && err.message);
            throw err;
        }
        
        // Find user in DB
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new apiError(404, "user not found");
        }

        // Attach the user to request
        req.user = user;
        next();
    } catch (error) {
        throw new apiError(401, "Invalid or Expired Token")
    }
})