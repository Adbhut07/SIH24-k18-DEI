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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = exports.getAllUsers = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = __importDefault(require("zod"));
const prisma = new client_1.PrismaClient();
const createUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters"),
    role: zod_1.default.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]),
});
const updateUserSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "Name must be at least 2 characters").optional(),
    email: zod_1.default.string().email("Invalid email format").optional(),
    password: zod_1.default.string().min(6, "Password must be at least 6 characters").optional(),
    role: zod_1.default.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]).optional(),
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = createUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const { name, email, password, role } = parsed.data;
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return res.status(201).json({
            success: true,
            data: user,
            message: "User created successfully",
        });
    }
    catch (error) {
        console.error("Error in createUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createUser = createUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const parsed = updateUserSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.errors });
        }
        const existingUser = yield prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const updatedUser = yield prisma.user.update({
            where: { id },
            data: parsed.data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: "User updated successfully",
        });
    }
    catch (error) {
        console.error("Error in updateUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingUser = yield prisma.user.findUnique({
            where: { id },
            include: { candidateProfile: true }, // Include related data
        });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Delete candidateProfile if it exists
        if (existingUser.candidateProfile) {
            yield prisma.candidateProfile.delete({ where: { candidateId: id } });
        }
        // Now delete the user
        yield prisma.user.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteUser:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
const getAllUsersQuerySchema = zod_1.default.object({
    role: zod_1.default.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]).optional(),
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = getAllUsersQuerySchema.parse(req.query);
        const whereCondition = query.role ? { role: query.role } : undefined;
        const users = yield prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        return res.status(200).json({
            success: true,
            data: users,
        });
    }
    catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getAllUsers = getAllUsers;
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const user = yield prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error in getUserByEmail:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Id is required",
            });
        }
        const user = yield prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        console.error("Error in getUserById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getUserById = getUserById;
