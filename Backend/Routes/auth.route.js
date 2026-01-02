import { Router } from 'express'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
import { authorizeRoles } from '../Middlewares/role.middleware.js'
import { ROLES } from '../Utils/roles.js'
import {
    registerUser,
    loginUser,
    logoutUser,
    updateAccessToken,
} from '../Controllers/user.controller.js'
import { upload } from '../Middlewares/multer.middleware.js'
import { resetPassword, verifyOTP, forgetPassword } from '../Controllers/forgetPassword.controller.js'

const router = Router();

router.route("/register").post(upload.single('profileImage'), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/update-token").post(updateAccessToken);

router.post("/forgot-password", forgetPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);


export default router;