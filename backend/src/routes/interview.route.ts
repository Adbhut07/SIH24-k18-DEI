import express from "express";
import { createInterviewSession, getAllInterviews, getInterviewById, updateInterviewSession, updateInterviewStatus } from "../controllers/interview/interview.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/create", protect, authorize(['ADMIN']), createInterviewSession);
router.patch("/interview-update/:id", protect, authorize(['ADMIN']), updateInterviewSession);
router.put("/status/:id", updateInterviewStatus);
router.get("/interviews",protect,authorize(['ADMIN']),getAllInterviews)
router.get("/interviews",protect, getInterviewById)



export default router;
