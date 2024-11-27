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
exports.getCandidateInterviews = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const getCandidateInterviewsSchema = zod_1.z.object({
    params: zod_1.z.object({
        email: zod_1.z.string().email(),
    }),
    query: zod_1.z.object({
        status: zod_1.z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]).optional(),
    }),
});
const getCandidateInterviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = getCandidateInterviewsSchema.parse({
        params: req.params,
        query: req.query
    });
    const { email } = validatedRequest.params;
    const { status } = validatedRequest.query;
    try {
        const candidate = yield prisma.user.findUnique({
            where: { email: email },
        });
        if (!candidate || candidate.role !== "CANDIDATE") {
            return res.status(404).json({
                success: false,
                message: "Candidate not found or user is not a candidate.",
            });
        }
        const userId = candidate.id;
        const interviews = yield prisma.interview.findMany({
            where: Object.assign({ candidateId: userId }, (status && { status })),
        });
        return res.status(200).json({
            success: true,
            message: "Candidate interviews retrieved successfully.",
            interviews,
        });
    }
    catch (error) {
        console.error("Error fetching candidate interviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch candidate interviews.",
            error: error.message,
        });
    }
});
exports.getCandidateInterviews = getCandidateInterviews;
