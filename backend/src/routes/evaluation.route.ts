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
router.get("/:id", protect, authorize(["ADMIN","INTERVIEWER"]), getEvaluationsByInterviewId);
router.put("/:id", protect, authorize(["ADMIN","INTERVIEWER"]), updateEvaluation);
router.delete("/:id", protect, authorize(["ADMIN","INTERVIEWER"]), deleteEvaluation);
router.put("/:interviewId/question-details", protect, authorize(["ADMIN","INTERVIEWER"]), addQuestionDetails);


export default router;
