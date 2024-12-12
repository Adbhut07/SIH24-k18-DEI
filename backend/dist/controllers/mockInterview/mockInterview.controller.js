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
exports.getMockInterviewById = exports.deleteMockInterview = exports.getAllMockInterviews = exports.createMockInterview = exports.mockInterviewSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
exports.mockInterviewSchema = zod_1.z.object({
    jobId: zod_1.z.string().nonempty("Job ID is required"),
    topics: zod_1.z.array(zod_1.z.string()).nonempty("Topics array cannot be empty"),
    title: zod_1.z.string().nonempty("Title is required"),
    description: zod_1.z.string().optional(),
    requiredExperience: zod_1.z.number().min(0, "Required experience must be a positive number"),
});
const createMockInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, topics, title, description, requiredExperience } = req.body;
    try {
        const validatedData = exports.mockInterviewSchema.parse({ jobId, topics, title, description, requiredExperience });
        const mockInterview = yield prisma.mockInterview.create({
            data: {
                jobId: validatedData.jobId,
                topics: validatedData.topics,
                title: validatedData.title,
                description: validatedData.description,
                requiredExperience: validatedData.requiredExperience
            },
        });
        return res.status(201).json({
            success: true,
            message: "Mock interview session created successfully",
            data: { mockInterview },
        });
    }
    catch (error) {
        console.error("Error creating mock interview session:", error);
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "An unexpected error occurred",
        });
    }
});
exports.createMockInterview = createMockInterview;
const getAllMockInterviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mockInterviews = yield prisma.mockInterview.findMany();
        return res.status(200).json({
            success: true,
            message: "Mock interviews retrieved successfully",
            data: { mockInterviews },
        });
    }
    catch (error) {
        console.error("Error fetching mock interviews:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "An unexpected error occurred",
        });
    }
});
exports.getAllMockInterviews = getAllMockInterviews;
const deleteMockInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const mockInterview = yield prisma.mockInterview.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: "Mock interview deleted successfully",
            data: { mockInterview },
        });
    }
    catch (error) {
        console.error("Error deleting mock interview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "An unexpected error occurred",
        });
    }
});
exports.deleteMockInterview = deleteMockInterview;
const getMockInterviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const mockInterview = yield prisma.mockInterview.findUnique({
            where: { id },
        });
        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: "Mock interview not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Mock interview retrieved successfully",
            data: { mockInterview },
        });
    }
    catch (error) {
        console.error("Error fetching mock interview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "An unexpected error occurred",
        });
    }
});
exports.getMockInterviewById = getMockInterviewById;
