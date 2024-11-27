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
exports.deleteCandidateProfile = exports.updateCandidateProfile = exports.getCandidateProfileByEmail = exports.createCandidateProfile = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Define validation schema using Zod
const candidateProfileSchema = zod_1.z.object({
    candidateId: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1, 'Name is required'),
    designation: zod_1.z.string().optional(),
    age: zod_1.z.number().int().min(18, 'Age must be at least 18').max(100, 'Age must be below 100').optional(),
    location: zod_1.z.string().optional(),
    aadharNumber: zod_1.z.string().length(12, 'Aadhar number must be 12 digits').optional(),
    email: zod_1.z.string().email('Invalid email address'),
    phoneNumber: zod_1.z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
    summary: zod_1.z.string().optional(),
    resume: zod_1.z.string().url('Invalid resume URL').optional(),
    medicalReport: zod_1.z.string().url('Invalid medical report URL').optional(),
    tenthMarks: zod_1.z.string().optional(),
    twelfthMarks: zod_1.z.string().optional(),
    gateScore: zod_1.z.string().optional(),
    jeeScore: zod_1.z.string().optional(),
    experience: zod_1.z.any().optional(),
    education: zod_1.z.any().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    achievements: zod_1.z.array(zod_1.z.string()).optional(),
});
const createCandidateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = candidateProfileSchema.parse(req.body);
        const user = yield prisma.user.findUnique({
            where: { id: validatedData.candidateId },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Candidate not found' });
        }
        if (user.role !== 'CANDIDATE') {
            return res.status(400).json({ success: false, message: 'User is not a candidate' });
        }
        const candidateProfile = yield prisma.candidateProfile.create({
            data: validatedData,
        });
        return res.status(201).json({ success: true, data: candidateProfile });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors,
            });
        }
        console.error('Error creating candidate profile:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.createCandidateProfile = createCandidateProfile;
const getCandidateProfileByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const candidateProfile = yield prisma.candidateProfile.findUnique({
            where: {
                email: email,
            },
            include: { candidate: true },
        });
        if (!candidateProfile) {
            return res.status(404).json({ success: false, message: 'Candidate profile not found' });
        }
        return res.status(200).json({ success: true, data: candidateProfile });
    }
    catch (error) {
        console.error('Error in getCandidateProfile:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getCandidateProfileByEmail = getCandidateProfileByEmail;
const updateCandidateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
    age: zod_1.z.number().int().min(18).max(100).optional(),
    location: zod_1.z.string().optional(),
    aadharNumber: zod_1.z.string().length(12).optional(),
    email: zod_1.z.string().email().optional(),
    phoneNumber: zod_1.z.string().regex(/^\d{10}$/).optional(),
    summary: zod_1.z.string().optional(),
    resume: zod_1.z.string().url().optional(),
    medicalReport: zod_1.z.string().url().optional(),
    tenthMarks: zod_1.z.string().optional(),
    twelfthMarks: zod_1.z.string().optional(),
    gateScore: zod_1.z.string().optional(),
    jeeScore: zod_1.z.string().optional(),
    experience: zod_1.z.any().optional(),
    education: zod_1.z.any().optional(),
    skills: zod_1.z.array(zod_1.z.string()).optional(),
    achievements: zod_1.z.array(zod_1.z.string()).optional(),
});
const updateCandidateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = updateCandidateProfileSchema.parse(req.body);
        const existingProfile = yield prisma.candidateProfile.findUnique({ where: { id } });
        if (!existingProfile) {
            return res.status(404).json({ success: false, message: 'Candidate profile not found' });
        }
        const updatedProfile = yield prisma.candidateProfile.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({ success: true, data: updatedProfile });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        console.error('Error in updateCandidateProfile:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.updateCandidateProfile = updateCandidateProfile;
const deleteCandidateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingProfile = yield prisma.candidateProfile.findUnique({ where: { id } });
        if (!existingProfile) {
            return res.status(404).json({ success: false, message: 'Candidate profile not found' });
        }
        yield prisma.candidateProfile.delete({
            where: { id },
        });
        return res.status(200).json({ success: true, message: 'Candidate profile deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteCandidateProfile:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.deleteCandidateProfile = deleteCandidateProfile;
