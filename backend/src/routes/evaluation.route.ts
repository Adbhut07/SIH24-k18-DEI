import express from "express";
import {
  createEvaluation,
  getEvaluations,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByInterviewId,
  addQuestionDetails,
} from "../controllers/evaluation/evaluation.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/", protect, authorize(["ADMIN", "INTERVIEWER"]), createEvaluation);
router.get("/", protect, authorize(["ADMIN","INTERVIEWER"]), getEvaluations);
router.get("/:interviewId", protect, authorize(["ADMIN","INTERVIEWER"]), getEvaluationsByInterviewId);
router.put("/:evaluationId", protect, authorize(["ADMIN","INTERVIEWER"]), updateEvaluation);
router.delete("/:evaluationId", protect, authorize(["ADMIN","INTERVIEWER"]), deleteEvaluation);
router.put("/:interviewId/question-details", addQuestionDetails);


export default router;
