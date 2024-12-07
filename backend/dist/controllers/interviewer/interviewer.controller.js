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
exports.getInterviewsByInterviewerId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getInterviewsByInterviewerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { interviewerId } = req.params;
    try {
        const interviews = yield prisma.interview.findMany({
            where: {
                interviewers: {
                    some: {
                        interviewerId: interviewerId
                    }
                }
            },
            include: {
                interviewers: {
                    include: {
                        interviewer: true // Include interviewer details
                    }
                },
                candidate: {
                    include: {
                        candidateProfile: true // Include candidate profile details
                    }
                }
            }
        });
        res.status(200).json({
            success: true,
            message: "Interviews fetched successfully",
            data: interviews
        });
    }
    catch (error) {
        console.error("Error in getInterviewsByInterviewerId:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.getInterviewsByInterviewerId = getInterviewsByInterviewerId;
