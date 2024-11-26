import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const getCandidateInterviewsSchema = z.object({
  params: z.object({
    email: z.string().email(),
  }),
  query: z.object({
    status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]).optional(),
  }),
});

export const getCandidateInterviews = async (req: Request, res: Response): Promise<any> => {
  const validatedRequest = getCandidateInterviewsSchema.parse({
    params: req.params,
    query: req.query
  });

  const { email } = validatedRequest.params;
  const { status } = validatedRequest.query;

  try {
    const candidate = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!candidate || candidate.role !== "CANDIDATE") {
      return res.status(404).json({
        success: false,
        message: "Candidate not found or user is not a candidate.",
      });
    }
    const userId = candidate.id;
    const interviews = await prisma.interview.findMany({
      where: {
        candidateId: userId,
        ...(status && { status }), 
      },
    });

    return res.status(200).json({
      success: true,
      message: "Candidate interviews retrieved successfully.",
      interviews,
    });
  } catch (error: any) {
    console.error("Error fetching candidate interviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate interviews.",
      error: error.message,
    });
  }
};



