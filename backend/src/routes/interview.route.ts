import express from "express";
import { createInterviewSession, updateInterviewSession } from "../controllers/interview/interview.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/create-interview ", protect, authorize(['ADMIN']), createInterviewSession);
router.patch("/interview-update", protect, authorize(['ADMIN']), updateInterviewSession);

export default router;
