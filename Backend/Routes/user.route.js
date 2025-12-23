import { Router } from 'express'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
import {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    updateAccessToken,
    updatePassword
} from '../Controllers/user.controller.js'

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/delete-user").get(verifyJWT, deleteUser);
router.route("/update-accessToken").get(verifyJWT, updateAccessToken);
router.route("/update-password").put(verifyJWT, updatePassword);

export default router;