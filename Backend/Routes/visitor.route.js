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
    deleteVisitor,
    generateGatePass,
    getGatePassByVisitor
} from "../Controllers/visitor.controller.js";

const router = Router();
router.route('/insert-visitor').post(verifyJWT, authorizeRoles(ROLES.Employee, ROLES.ADMIN, ROLES.HOD), upload.single("visitorImage"), insertVisitor);
router.route('/get-all-visitor').get(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN, ROLES.HOD), getAllVisitors);
router.route("/search-visitor").get(verifyJWT, authorizeRoles(ROLES.SECURITY, ROLES.ADMIN, ROLES.HOD), searchVisitor);
router.route("/toggle-status/:visitorId").put(verifyJWT, authorizeRoles(ROLES.ADMIN, ROLES.HOD), toggleStatus);
router.route("/delete-visitors").delete(verifyJWT, authorizeRoles(ROLES.ADMIN, ROLES.HOD), deleteVisitor);
router.post("/generate-gatepass/:visitorId", verifyJWT, authorizeRoles(ROLES.SECURITY), generateGatePass);
router.get("/gatepass/:visitorId", verifyJWT, authorizeRoles(ROLES.SECURITY), getGatePassByVisitor);


export default router