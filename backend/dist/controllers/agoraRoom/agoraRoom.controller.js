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
exports.deleteRoom = exports.updateRoom = exports.getRoom = exports.getRooms = exports.createRoom = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createRoomSchema = zod_1.z.object({
    appId: zod_1.z.string().min(1, "App ID is required"),
    channel: zod_1.z.string().min(1, "Channel is required"),
    appCertificate: zod_1.z.string().min(1, "App Certificate is required"),
});
const updateRoomSchema = zod_1.z.object({
    channel: zod_1.z.string().min(1, "Channel must be a non-empty string").optional(),
    appCertificate: zod_1.z.string().min(1, "App Certificate must be a non-empty string").optional(),
    inUse: zod_1.z.boolean().optional(),
});
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatedData = createRoomSchema.parse(req.body);
    const { appId, channel, appCertificate } = validatedData;
    try {
        const newRoom = yield prisma.room.create({
            data: {
                appId,
                channel,
                appCertificate,
            },
        });
        res.status(201).json({
            success: true,
            message: "Room created successfully",
            data: newRoom,
        });
    }
    catch (error) {
        console.error("Error in createRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createRoom = createRoom;
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield prisma.room.findMany({
            where: {
                inUse: false,
            },
        });
        res.status(200).json({
            success: true,
            message: "Rooms fetched successfully",
            data: rooms,
        });
    }
    catch (error) {
        console.error("Error in getRooms:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getRooms = getRooms;
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appId } = req.params;
    try {
        const room = yield prisma.room.findUnique({
            where: { appId },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({
            success: true,
            message: "Room fetched successfully",
            data: room,
        });
    }
    catch (error) {
        console.error("Error in getRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getRoom = getRoom;
const updateRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appId } = req.params;
    try {
        const validatedData = updateRoomSchema.parse(req.body);
        const updatedRoom = yield prisma.room.update({
            where: { appId },
            data: validatedData,
        });
        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            data: updatedRoom,
        });
    }
    catch (error) {
        console.error("Error in updateRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateRoom = updateRoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appId } = req.params;
    try {
        yield prisma.room.delete({
            where: { appId },
        });
        res.status(200).json({
            success: true,
            message: "Room deleted successfully",
        });
    }
    catch (error) {
        console.error("Error in deleteRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteRoom = deleteRoom;
