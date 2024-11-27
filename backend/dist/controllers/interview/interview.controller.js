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
exports.checkInterviewUpdatePermissions = exports.findInterviewByRoomId = exports.updateInterviewStatus = exports.updateInterviewSession = exports.createInterviewSession = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
const createInterviewSessionSchema = zod_1.z.object({
    title: zod_1.z.string().nonempty("Title is required"),
    description: zod_1.z.string().optional(),
    candidateId: zod_1.z.string().nonempty("Candidate ID is required"),
    interviewerIds: zod_1.z.array(zod_1.z.string()).nonempty("At least one interviewer ID is required"),
    scheduledAt: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Scheduled date must be a valid ISO date",
    }),
    usePredefined: zod_1.z.boolean().optional(),
});
const updateInterviewSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid interview session ID."),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        scheduledAt: zod_1.z.string().optional().refine((date) => date ? !isNaN(Date.parse(date)) : true, {
            message: "Scheduled date must be a valid ISO date",
        }),
        status: zod_1.z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]).optional(),
    }),
});
const updateInterviewStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid interview session ID."),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]),
    }),
});
// i have not addded to check if a interview for same candidate is already esiist or not (I feel not needed)
const createInterviewSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = createInterviewSessionSchema.safeParse(req.body);
    if (!parseResult.success) {
        const errors = parseResult.error.format();
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors,
        });
    }
    const { title, description, candidateId, interviewerIds, scheduledAt, usePredefined } = parseResult.data;
    try {
        const candidate = yield prisma.user.findUnique({
            where: { id: candidateId },
        });
        if (!candidate || candidate.role !== "CANDIDATE") {
            return res.status(404).json({ success: false, message: "Candidate not found or invalid role" });
        }
        const interviewers = yield prisma.user.findMany({
            where: {
                id: { in: interviewerIds },
                role: "INTERVIEWER",
            },
        });
        if (interviewers.length !== interviewerIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more interviewers not found or invalid role",
            });
        }
        const interview = yield prisma.interview.create({
            data: {
                title,
                description,
                candidateId,
                scheduledAt: new Date(scheduledAt),
                usePredefined: usePredefined !== null && usePredefined !== void 0 ? usePredefined : false,
                interviewers: {
                    create: interviewerIds.map((interviewerId) => ({
                        interviewerId,
                    })),
                },
                roomId: (0, uuid_1.v4)(),
            },
            include: {
                candidate: true,
                interviewers: {
                    include: {
                        interviewer: true,
                    },
                },
            },
        });
        return res.status(201).json({
            success: true,
            message: "Interview session created successfully",
            interview,
        });
    }
    catch (error) {
        console.error("Error creating interview session:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message || "An unexpected error occurred",
        });
    }
});
exports.createInterviewSession = createInterviewSession;
const updateInterviewSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseResult = updateInterviewSessionSchema.safeParse(req);
    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: parseResult.error.format(),
        });
    }
    const { id } = parseResult.data.params;
    const { title, description, scheduledAt, status } = parseResult.data.body;
    try {
        const updatedInterview = yield prisma.interview.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (scheduledAt && { scheduledAt: new Date(scheduledAt) })), (status && { status })),
        });
        return res.status(200).json({
            success: true,
            message: "Interview session updated successfully",
            interview: updatedInterview,
        });
    }
    catch (error) {
        console.error("Error updating interview session:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update interview session.",
            error: error.message,
        });
    }
});
exports.updateInterviewSession = updateInterviewSession;
const updateInterviewStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!["SCHEDULED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status provided.",
        });
    }
    try {
        const updatedStatus = yield prisma.interview.update({
            where: { id },
            data: { status },
        });
        return res.status(200).json({
            success: true,
            message: "Interview session status updated successfully.",
            updatedStatus,
        });
    }
    catch (error) {
        console.error("Error updating interview status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update interview session status.",
            error: error.message,
        });
    }
});
exports.updateInterviewStatus = updateInterviewStatus;
const findInterviewByRoomId = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.interview.findUnique({
        where: { roomId },
        include: {
            candidate: true,
            interviewers: {
                include: { interviewer: true },
            },
        },
    });
});
exports.findInterviewByRoomId = findInterviewByRoomId;
// not need currently
const canUpdateInterview = (userId, interviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const interview = yield prisma.interview.findUnique({
        where: { id: interviewId },
        include: {
            interviewers: {
                select: {
                    interviewerId: true,
                },
            },
        },
    });
    if (!interview)
        return false;
    return interview.interviewers.some((interviewer) => interviewer.interviewerId === userId);
});
const checkInterviewUpdatePermissions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { interviewId } = req.body;
    if (!userId || !interviewId) {
        return res.status(400).json({
            success: false,
            message: "Missing required information",
        });
    }
    try {
        const hasPermission = yield canUpdateInterview(userId, interviewId);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to update this interview",
            });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking permissions",
        });
    }
});
exports.checkInterviewUpdatePermissions = checkInterviewUpdatePermissions;
