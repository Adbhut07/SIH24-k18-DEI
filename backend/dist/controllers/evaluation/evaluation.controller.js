"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvaluation = exports.addQuestionDetails = exports.updateEvaluation = exports.getEvaluationsByInterviewId = exports.getEvaluations = exports.createEvaluation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const markSchema = zod_1.z.object({
    interviewerId: zod_1.z.string().uuid("Invalid interviewer ID"),
    score: zod_1.z.number().min(0).max(10, "Score should be between 0 and 10"),
});
const evaluationItemSchema = zod_1.z.object({
    question: zod_1.z.string().min(1, "Question cannot be empty"),
    candidate_ans: zod_1.z.string().min(1, "Candidate answer cannot be empty"),
    ideal_ans: zod_1.z.string().min(1, "Ideal answer cannot be empty"),
    toughness: zod_1.z.number().min(0).max(10, "Relevancy score should be between 0 and 10").optional(),
    relevancy: zod_1.z.string().optional(),
    topic: zod_1.z.string().min(1, "Topic cannot be empty"),
    feedback_ai: zod_1.z.string().min(1, "Feedback cannot be empty"),
    category: zod_1.z.string().optional(),
    marks_given_by_interviewers: zod_1.z.array(markSchema).min(1, "At least one mark is required"),
});
const createEvaluationSchema = zod_1.z.object({
    interviewId: zod_1.z.string().uuid("Invalid interview ID"),
    questionDetails: zod_1.z.array(evaluationItemSchema).min(1, "At least one question detail is required").optional(),
    feedbackInterviewer: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    feedbackCandidate: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    relevancyAI: zod_1.z.number().optional(),
    relevancyCandidate: zod_1.z.number().optional(),
    idealAnswerAI: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    marksAI: zod_1.z.number().optional(),
});
const updateEvaluationSchema = createEvaluationSchema.partial();
// Create Evaluation
const createEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const validatedData = createEvaluationSchema.parse(req.body);
        const questionDetails = (_a = validatedData.questionDetails) !== null && _a !== void 0 ? _a : [];
        const newEvaluation = yield prisma.evaluation.create({
            data: Object.assign(Object.assign({}, validatedData), { questionDetails, feedbackInterviewer: (_b = validatedData.feedbackInterviewer) !== null && _b !== void 0 ? _b : {}, feedbackCandidate: (_c = validatedData.feedbackCandidate) !== null && _c !== void 0 ? _c : {}, idealAnswerAI: (_d = validatedData.idealAnswerAI) !== null && _d !== void 0 ? _d : {} }),
        });
        res.status(201).json({
            success: true,
            message: "Evaluation created successfully",
            data: newEvaluation,
        });
    }
    catch (error) {
        console.error("Error in createEvaluation:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
});
exports.createEvaluation = createEvaluation;
/// Get All Evaluations
const getEvaluations = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const evaluations = yield prisma.evaluation.findMany({
            include: { interview: true },
        });
        res.status(200).json({
            success: true,
            message: "Evaluations fetched successfully",
            data: evaluations,
        });
    }
    catch (error) {
        console.error("Error in getEvaluations:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getEvaluations = getEvaluations;
/// Get Evaluations By Interview ID
const getEvaluationsByInterviewId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId } = req.params;
    try {
        const evaluations = yield prisma.evaluation.findMany({
            where: { interviewId },
            include: { interview: true },
        });
        if (!evaluations.length) {
            res.status(404).json({
                success: false,
                message: `No evaluations found for interview ID: ${interviewId}`,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Evaluations fetched successfully",
            data: evaluations,
        });
    }
    catch (error) {
        console.error("Error in getEvaluationsByInterviewId:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.getEvaluationsByInterviewId = getEvaluationsByInterviewId;
/// Update Evaluation
const updateEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { evaluationId } = req.params;
    try {
        const validatedData = updateEvaluationSchema.parse(req.body);
        const updatedEvaluation = yield prisma.evaluation.update({
            where: { id: evaluationId },
            data: validatedData,
        });
        res.status(200).json({
            success: true,
            message: "Evaluation updated successfully",
            data: updatedEvaluation,
        });
    }
    catch (error) {
        console.error("Error in updateEvaluation:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
});
exports.updateEvaluation = updateEvaluation;
const addQuestionDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId } = req.params;
    try {
        const { questionDetails } = req.body;
        const validatedQuestionDetails = zod_1.z
            .array(evaluationItemSchema)
            .parse(questionDetails);
        const evaluation = yield prisma.evaluation.findUnique({
            where: { interviewId },
        });
        if (!evaluation) {
            res.status(404).json({
                success: false,
                message: `Evaluation not found for interview ID: ${interviewId}`,
            });
            return;
        }
        const updatedQuestionDetails = [
            ...evaluation.questionDetails,
            ...validatedQuestionDetails,
        ];
        const updatedEvaluation = yield prisma.evaluation.update({
            where: { id: evaluation.id },
            data: { questionDetails: updatedQuestionDetails },
        });
        res.status(200).json({
            success: true,
            message: "Question details added successfully",
            data: updatedEvaluation,
        });
    }
    catch (error) {
        console.error("Error in addQuestionDetails:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors,
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
});
exports.addQuestionDetails = addQuestionDetails;
/// Delete Evaluation
const deleteEvaluation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { evaluationId } = req.params;
    try {
        yield prisma.evaluation.delete({
            where: { id: evaluationId },
        });
        res.status(200).json({
            success: true,
            message: "Evaluation deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteEvaluation:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});
exports.deleteEvaluation = deleteEvaluation;
