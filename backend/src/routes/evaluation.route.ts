import express from "express";
import {
  createEvaluation,
  getEvaluations,
  updateEvaluation,
  deleteEvaluation,
  getEvaluationsByInterviewId,
} from "../controllers/evaluation/evaluation.controller";
import { authorize, protect } from "../utils/auth.middleware";

const router = express.Router();

router.post("/", protect, authorize(["ADMIN"]), createEvaluation);
router.get("/", protect, authorize(["ADMIN"]), getEvaluations);
router.get("/:id", protect, authorize(["ADMIN"]), getEvaluationsByInterviewId);
router.put("/:id", protect, authorize(["ADMIN"]), updateEvaluation);
router.delete("/:id", protect, authorize(["ADMIN"]), deleteEvaluation);

export default router;
