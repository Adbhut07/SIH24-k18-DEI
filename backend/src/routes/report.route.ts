import express from 'express';
import { getEvaluationByInterviewer } from '../controllers/evaluation/report.controller';

const router = express.Router();

router.get('/evaluation/:interviewId/:interviewerId', getEvaluationByInterviewer);

export default router;
