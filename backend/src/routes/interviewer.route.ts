import express from 'express';
import { getInterviewsByInterviewerId } from '../controllers/interviewer/inerviewer.controller';
import { authorize, protect } from '../utils/auth.middleware';

const router = express.Router();

router.get("/getInterviews/:interviewerId", protect, authorize(["INTERVIEWER"]), getInterviewsByInterviewerId);

export default router;