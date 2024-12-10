"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluation_controller_1 = require("../controllers/evaluation/evaluation.controller");
const auth_middleware_1 = require("../utils/auth.middleware");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.createEvaluation);
router.get("/", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.getEvaluations);
<<<<<<< HEAD
router.get("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.getEvaluationsByInterviewId);
router.put("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.updateEvaluation);
router.delete("/:id", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.deleteEvaluation);
router.put("/:interviewId/question-details", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.addQuestionDetails);
=======
router.get("/:interviewId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.getEvaluationsByInterviewId);
router.put("/:evaluationId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.updateEvaluation);
router.delete("/:evaluationId", auth_middleware_1.protect, (0, auth_middleware_1.authorize)(["ADMIN", "INTERVIEWER"]), evaluation_controller_1.deleteEvaluation);
router.put("/:interviewId/question-details", evaluation_controller_1.addQuestionDetails);
>>>>>>> db2a0412d08fbfe11708ab802071fe7e634be087
exports.default = router;
