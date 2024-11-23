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
exports.checkInterviewUpdatePermissions = exports.getRoundsForInterview = exports.addRoundsToInterview = exports.deleteRound = exports.updateRoundDetails = exports.updateInterviewStatus = exports.updateInterviewSession = exports.createInterviewSession = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
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
    rounds: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().nonempty("Round name is required"),
        scheduledAt: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Scheduled date for round must be a valid ISO date",
        }),
        details: zod_1.z.string().optional(),
    })).nonempty("At least one round is required"),
});
const updateInterviewSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid interview session ID."),
    }),
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        schedule: zod_1.z.date().optional(),
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
    const { title, description, candidateId, interviewerIds, scheduledAt, usePredefined, rounds } = parseResult.data;
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
                rounds: {
                    create: rounds.map((round) => ({
                        name: round.name,
                        scheduledAt: new Date(round.scheduledAt),
                        details: round.details,
                        status: "SCHEDULED",
                    })),
                },
            },
            include: {
                candidate: true,
                interviewers: {
                    include: {
                        interviewer: true,
                    },
                },
                rounds: true,
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
    const { id } = req.params;
    const { title, description, schedule } = req.body;
    try {
        const updatedSession = yield prisma.interview.update({
            where: { id },
            data: Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (schedule && { schedule })),
        });
        return res.status(200).json({
            success: true,
            message: "Interview session updated successfully.",
            updatedSession,
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
//************************************** Rounds *******************************  */
const RoundStatus = zod_1.z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]);
const UpdateRoundDetailsSchema = zod_1.z.object({
    params: zod_1.z.object({
        interviewId: zod_1.z.string().uuid("Invalid interview session ID"),
        roundId: zod_1.z.string().uuid("Invalid round ID"),
    }),
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name cannot be empty").optional(),
        scheduledAt: zod_1.z.string().datetime("Invalid date format").optional(),
        status: RoundStatus.optional(),
    }),
});
const deleteRoundSchema = zod_1.z.object({
    params: zod_1.z.object({
        interviewId: zod_1.z.string().uuid("Invalid interview session ID."),
        roundId: zod_1.z.string().uuid("Invalid round ID."),
    }),
});
const updateRoundDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = UpdateRoundDetailsSchema.parse({
        params: req.params,
        body: req.body,
    });
    const { interviewId, roundId } = validatedRequest.params;
    const { name, scheduledAt, status } = validatedRequest.body;
    try {
        const round = yield prisma.round.findFirst({
            where: { id: roundId, interviewId },
        });
        if (!round) {
            return res.status(404).json({
                success: false,
                message: "Round not found or does not belong to the specified interview.",
            });
        }
        const updatedRound = yield prisma.round.update({
            where: { id: roundId },
            data: Object.assign(Object.assign(Object.assign({}, (name && { name })), (scheduledAt && { scheduledAt })), (status && { status })),
        });
        return res.status(200).json({
            success: true,
            message: "Round details updated successfully.",
            updatedRound,
        });
    }
    catch (error) {
        console.error("Error updating round details:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update round details.",
            error: error.message,
        });
    }
});
exports.updateRoundDetails = updateRoundDetails;
const deleteRound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = deleteRoundSchema.parse({
        params: req.params,
    });
    const { interviewId, roundId } = validatedRequest.params;
    try {
        const round = yield prisma.round.findFirst({
            where: { id: roundId, interviewId },
        });
        if (!round) {
            return res.status(404).json({
                success: false,
                message: "Round not found.",
            });
        }
        yield prisma.round.delete({
            where: { id: roundId },
        });
        return res.status(200).json({
            success: true,
            message: "Round deleted successfully.",
        });
    }
    catch (error) {
        console.error("Error deleting round:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete round.",
            error: error.message,
        });
    }
});
exports.deleteRound = deleteRound;
const addRoundsSchema = zod_1.z.object({
    params: zod_1.z.object({
        interviewId: zod_1.z.string().uuid("Invalid interview session ID."),
    }),
    body: zod_1.z.object({
        rounds: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string(),
            schedule: zod_1.z.date(),
            status: zod_1.z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
        }))
            .min(1, "At least one round must be provided."),
    }),
});
const getRoundsSchema = zod_1.z.object({
    params: zod_1.z.object({
        interviewId: zod_1.z.string().uuid("Invalid interview session ID."),
    }),
});
const addRoundsToInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = addRoundsSchema.safeParse({ params: req.params, body: req.body });
    if (!validatedRequest.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: validatedRequest.error.format(),
        });
    }
    const { interviewId } = validatedRequest.data.params;
    const { rounds } = validatedRequest.data.body;
    try {
        const interview = yield prisma.interview.findUnique({
            where: { id: interviewId },
        });
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found.",
            });
        }
        const createdRounds = yield prisma.round.createMany({
            data: rounds.map((round) => (Object.assign(Object.assign({}, round), { interviewId }))),
        });
        return res.status(201).json({
            success: true,
            message: "Rounds added successfully.",
            createdRoundsCount: createdRounds.count,
        });
    }
    catch (error) {
        console.error("Error adding rounds to interview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message || "An unexpected error occurred.",
        });
    }
});
exports.addRoundsToInterview = addRoundsToInterview;
const getRoundsForInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedRequest = getRoundsSchema.safeParse({ params: req.params });
    if (!validatedRequest.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: validatedRequest.error.format(),
        });
    }
    const { interviewId } = validatedRequest.data.params;
    try {
        const interview = yield prisma.interview.findUnique({
            where: { id: interviewId },
        });
        if (!interview) {
            return res.status(404).json({
                success: false,
                message: "Interview session not found.",
            });
        }
        const rounds = yield prisma.round.findMany({
            where: { interviewId },
            orderBy: { scheduledAt: "asc" },
        });
        return res.status(200).json({
            success: true,
            message: "Rounds fetched successfully.",
            rounds,
        });
    }
    catch (error) {
        console.error("Error fetching rounds for interview:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
            error: error.message || "An unexpected error occurred.",
        });
    }
});
exports.getRoundsForInterview = getRoundsForInterview;
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
