import { Router } from 'express'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
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

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// update access token using refresh token (no access token required)
router.route("/update-token").post(updateAccessToken);

// secure routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/delete-user").delete(verifyJWT, deleteUser);
router.route("/update-password").put(verifyJWT, updatePassword);
router.route("/get-all-users").get(verifyJWT, getAllAdminAndSecurity);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

export default router;