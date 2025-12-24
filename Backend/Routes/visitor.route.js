import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import {
    insertVisitor,
    getAllVisitors,
    searchVisitor,
    toggleStatus,
    deleteVisitor
} from "../Controllers/visitor.controller.js";

const router = Router();
router.route('/insert-visitor').post(verifyJWT, upload.single("visitorImgae"), insertVisitor);
router.route('/get-all-visitor').get(verifyJWT, getAllVisitors);
router.route("/search-visitor").get(verifyJWT, searchVisitor);
router.route("/toggle-status/:visitorId").put(verifyJWT, toggleStatus);
router.route("/delete-visitors").delete(verifyJWT, deleteVisitor);

export default router