import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

export const mockInterviewSchema = z.object({
    jobId: z.string().nonempty("Job ID is required"),
    topics: z.array(z.string()).nonempty("Topics array cannot be empty"),
    title: z.string().nonempty("Title is required"),
    description: z.string().optional(),
    requiredExperience: z.number().int().min(0, "Required experience must be a positive number"),
  });
  
  export const createMockInterview = async (req: Request, res: Response): Promise<any> => {
  
    try {
        const validatedData = mockInterviewSchema.parse(req.body); // Parse entire body
      
        const mockInterview = await prisma.mockInterview.create({
          data: validatedData, // Use spread of validated data directly
        });
  
      return res.status(201).json({
        success: true,
        message: "Mock interview session created successfully",
        data: { mockInterview },
      });
    } catch (error: any) {
      console.error("Error creating mock interview session:", error);
  
      if (error instanceof z.ZodError) {
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
  };
  
export const getAllMockInterviews = async (req: Request, res: Response): Promise<any> => {
    try {
      const mockInterviews = await prisma.mockInterview.findMany();
  
      return res.status(200).json({
        success: true,
        message: "Mock interviews retrieved successfully",
        data: { mockInterviews },
      });
    } catch (error: any) {
      console.error("Error fetching mock interviews:", error);
  
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }
  };

export const deleteMockInterview = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
  
    try {
      const mockInterview = await prisma.mockInterview.delete({
        where: { id },
      });
  
      return res.status(200).json({
        success: true,
        message: "Mock interview deleted successfully",
        data: { mockInterview },
      });
    } catch (error: any) {
      console.error("Error deleting mock interview:", error);
  
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }
  };

export const getMockInterviewById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
  
    try {
      const mockInterview = await prisma.mockInterview.findUnique({
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
    } catch (error: any) {
      console.error("Error fetching mock interview:", error);
  
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }
  };


//create a controller function for getting all mock interviews title and id
export const getAllMockInterviewsTitle = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log("ho")
      const mockInterviews = await prisma.mockInterview.findMany({
        select: {
          id: true,
          title: true,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Mock interviews retrieved successfully",
        data: { mockInterviews },
      });
    } catch (error: any) {
      console.error("Error fetching mock interviews:", error);
  
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message || "An unexpected error occurred",
      });
    }    
}