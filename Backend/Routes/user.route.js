import { Router } from 'express'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
import { authorizeRoles } from '../Middlewares/role.middleware.js'
import { ROLES } from '../Utils/roles.js'
import {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    updateAccessToken,
    updatePassword,
    getAllAdminAndSecurity,
    getCurrentUser
} from '../Controllers/user.controller.js'

const router = Router();

// router.route("/register").post(verifyJWT, authorizeRoles(ROLES.ADMIN), registerUser);
// router.route("/login").post(loginUser);
// update access token using refresh token (no access token required)
router.route("/update-token").post(updateAccessToken);

// secure routes
router.route("/delete-user").delete(verifyJWT, authorizeRoles(ROLES.ADMIN), deleteUser);
router.route("/update-password").put(verifyJWT, authorizeRoles(ROLES.ADMIN), updatePassword);
router.route("/get-all-users").get(verifyJWT, authorizeRoles(ROLES.ADMIN), getAllAdminAndSecurity);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

export default router;