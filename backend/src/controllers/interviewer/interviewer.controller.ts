import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInterviewsByInterviewerId = async (req: Request, res: Response): Promise<any> => {
  const { interviewerId } = req.params;

  try {
    const interviews = await prisma.interview.findMany({
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
  } catch (error) {
    console.error("Error in getInterviewsByInterviewerId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
