class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.message = message
        this.status = statusCode
        this.data = null
        this.stack = stack
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

        console.log("Error message in errorHandling", statusCode, this.data, message);
    }
}

export default apiError