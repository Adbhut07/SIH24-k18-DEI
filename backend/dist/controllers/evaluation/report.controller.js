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
exports.getEvaluationByInterviewer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEvaluationByInterviewer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewId, interviewerId } = req.params;
    try {
        // Validate input parameters
        if (!interviewId || !interviewerId) {
            return res
                .status(400)
                .json({ message: "interviewId and interviewerId are required." });
        }
        // Fetch evaluation record from the database
        const evaluation = yield prisma.evaluation.findUnique({
            where: { interviewId },
        });
        if (!evaluation) {
            return res
                .status(404)
                .json({
                message: "Evaluation not found for the provided interviewId.",
            });
        }
        const questionDetails = evaluation.questionDetails;
        if (!questionDetails) {
            return res.status(200).json([]); // Return an empty array if questionDetails is null
        }
        const filteredQuestions = questionDetails.filter((question) => question.marks_given_by_interviewers.some((mark) => mark.interviewerId === interviewerId));
        return res.status(200).json({
            success: true,
            message: "data fetched successfully",
            data: filteredQuestions
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({
            success: false,
            message: "An error occurred while fetching evaluation data.",
            error: error.message,
        });
    }
});
exports.getEvaluationByInterviewer = getEvaluationByInterviewer;
