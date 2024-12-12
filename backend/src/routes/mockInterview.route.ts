import express from 'express';
import { createMockInterview, deleteMockInterview, getAllMockInterviews, getMockInterviewById } from '../controllers/mockInterview/mockInterview.controller';

const router = express.Router();

router.post("/create", createMockInterview);
router.get("/getAll", getAllMockInterviews);
router.get("/get/:id", getMockInterviewById);
router.delete("/delete/:id", deleteMockInterview);

export default router;