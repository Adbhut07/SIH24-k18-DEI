import express from "express";
import { createInterviewSession, updateInterviewSession, updateInterviewStatus } from "../controllers/interview/interview.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/create", protect, authorize(['ADMIN']), createInterviewSession);
router.patch("/interview-update", protect, authorize(['ADMIN']), updateInterviewSession);
router.put("/status", updateInterviewStatus);


export default router;
