import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import zod from "zod";

const prisma = new PrismaClient();

const createUserSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email format"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  role: zod.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]),
});

const updateUserSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters").optional(),
  email: zod.string().email("Invalid email format").optional(),
  password: zod.string().min(6, "Password must be at least 6 characters").optional(),
  role: zod.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]).optional(),
});


export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const { name, email, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
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
  } catch (error) {
    console.error("Error in createUser:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, errors: parsed.error.errors });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
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
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { candidateProfile: true }, // Include related data
    });

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete candidateProfile if it exists
    if (existingUser.candidateProfile) {
      await prisma.candidateProfile.delete({ where: { candidateId: id } });
    }

    // Now delete the user
    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getAllUsersQuerySchema = zod.object({
  role: zod.enum(["CANDIDATE", "INTERVIEWER", "ADMIN"]).optional(), 
});

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const query = getAllUsersQuerySchema.parse(req.query);

    const whereCondition = query.role ? { role: query.role } : undefined;

    const users = await prisma.user.findMany({
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
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserByEmail = async (req: Request, res: Response):Promise<any> => {
  try {
    const { email } = req.body;
    if(!email){
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Error in getUserByEmail:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getUserById = async (req: Request, res: Response):Promise<any> => {
  try { 
    const { id } = req.params;
    if(!id){
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

