import express from "express";
import { addRoundsToInterview, createInterviewSession, deleteRound, getRoundsForInterview, updateInterviewSession, updateInterviewStatus, updateRoundDetails } from "../controllers/interview/interview.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/create", protect, authorize(['ADMIN']), createInterviewSession);
router.patch("/interview-update", protect, authorize(['ADMIN']), updateInterviewSession);
router.put("/status", updateInterviewStatus);

router.post("/interviews/:id/rounds",protect, authorize(['ADMIN']), addRoundsToInterview); 
router.get("/interviews/:id/rounds",protect, authorize(['ADMIN']), getRoundsForInterview); 
router.put("/interviews/:interviewId/rounds/:roundId",protect, authorize(['ADMIN']),updateRoundDetails);
router.delete("/interviews/:interviewId/rounds/:roundId",protect, authorize(['ADMIN']),deleteRound);

export default router;
