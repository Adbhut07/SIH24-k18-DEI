import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

const prisma = new PrismaClient();

const createRoomSchema = z.object({
    appId: z.string().min(1, "App ID is required"),
    channel: z.string().min(1, "Channel is required"),
    appCertificate: z.string().min(1, "App Certificate is required"),
  });
  
  const updateRoomSchema = z.object({
    channel: z.string().min(1, "Channel must be a non-empty string").optional(),
    appCertificate: z.string().min(1, "App Certificate must be a non-empty string").optional(),
    inUse: z.boolean().optional(),
  });

export const createRoom = async (req: Request, res: Response):Promise<any> => {

    const validatedData = createRoomSchema.parse(req.body);
    const { appId, channel, appCertificate } = validatedData;
  
    try {
      const newRoom = await prisma.room.create({
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
    } catch (error) {
        console.error("Error in createRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
  };

export const getRooms = async (req: Request, res: Response):Promise<any> => {
    try {
      const rooms = await prisma.room.findMany({
        where: {
            inUse: false,
        },
      });
  
      res.status(200).json({
        success: true,
        message: "Rooms fetched successfully",
        data: rooms,
      });
    } catch (error) {
        console.error("Error in getRooms:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const getRoom = async (req: Request, res: Response):Promise<any> => {
    const { appId } = req.params;
  
    try {
      const room = await prisma.room.findUnique({
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
    } catch (error) {
        console.error("Error in getRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
  
export const updateRoom = async (req: Request, res: Response):Promise<any> => {
    
    const { appId } = req.params;
  
    try {
        const validatedData = updateRoomSchema.parse(req.body);

        const updatedRoom = await prisma.room.update({
            where: { appId },
            data: validatedData,
        });
  
      res.status(200).json({
        success: true,
        message: "Room updated successfully",
        data: updatedRoom,
      });
    } catch (error) {
        console.error("Error in updateRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};
  
export const deleteRoom = async (req: Request, res: Response):Promise<any> => {
    const { appId } = req.params;
  
    try {
      await prisma.room.delete({
        where: { appId },
      });
  
      res.status(200).json({
        success: true,
        message: "Room deleted successfully",
      });
    } catch (error) {
        console.error("Error in deleteRoom:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
};
  