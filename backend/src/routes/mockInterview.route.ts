import express from 'express';
import { createMockInterview, deleteMockInterview, getAllMockInterviews, getAllMockInterviewsTitle, getMockInterviewById } from '../controllers/mockInterview/mockInterview.controller';

const router = express.Router();

router.post("/create", createMockInterview);
router.get("/getAll", getAllMockInterviews);
router.get("/get/:id", getMockInterviewById);
router.delete("/delete/:id", deleteMockInterview);
router.get('/getAllTitles', getAllMockInterviewsTitle)
export default router;