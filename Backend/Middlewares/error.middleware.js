import apiResponse from "../Utils/apiResponse.js"

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error"

    res.status(statusCode).json(
        new apiResponse(
            statusCode,
            null,
            message
        )
    )
}