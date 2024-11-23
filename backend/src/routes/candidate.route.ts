import express from "express";
import { getCandidateInterviews } from "../controllers/candidate/candidate.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.get("/:userId/interviews", protect, authorize(["CANDIDATE", "ADMIN"]), getCandidateInterviews);

export default router;
