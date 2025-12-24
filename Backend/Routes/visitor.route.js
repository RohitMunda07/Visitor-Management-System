import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { authorizeRoles } from '../Middlewares/role.middleware.js'
import { ROLES } from '../Utils/roles.js'
import {
    insertVisitor,
    getAllVisitors,
    searchVisitor,
    toggleStatus,
    deleteVisitor
} from "../Controllers/visitor.controller.js";

const router = Router();
router.route('/insert-visitor').post(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN), upload.single("visitorImgae"), insertVisitor);
router.route('/get-all-visitor').get(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN), getAllVisitors);
router.route("/search-visitor").get(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN), searchVisitor);
router.route("/toggle-status/:visitorId").put(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN), toggleStatus);
router.route("/delete-visitors").delete(verifyJWT, authorizeRoles(ROLES.ADMIN), deleteVisitor);

export default router