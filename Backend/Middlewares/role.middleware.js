import apiError from "../Utils/errorHandler.js";

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
        throw new apiError(403, "Forbidden: insufficient privileges");
    }
    next();
};

export default authorizeRoles;
