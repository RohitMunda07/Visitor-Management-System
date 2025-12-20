import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../Controllers/user.controller.js'
import { verifyJWT } from '../Middlewares/auth.middleware.js'
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);

export default router;