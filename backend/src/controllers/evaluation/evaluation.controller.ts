import { z } from "zod";
// Update Evaluation Schema

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mark Schema
const markSchema = z.object({
  interviewerId: z.string().uuid("Invalid interviewer ID"),
  score: z.number().min(0).max(10, "Score should be between 0 and 10"),
});

// Evaluation Item Schema
const evaluationItemSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  ideal_ans: z.string().min(1, "Ideal answer cannot be empty"),
  toughness: z.number().min(0).max(10, "Relevancy score should be between 0 and 10"),
  relevancy:z.string().optional(),
  topic: z.string().min(1, "Topic cannot be empty"),
  feedback_ai: z.string().min(1, "Feedback cannot be empty"),
  category: z.string().optional(),
  marks_given_by_interviewers: z.array(markSchema).min(1, "At least one mark is required"),
});

// Create Evaluation Schema
const createEvaluationSchema = z.object({
  interviewId: z.string().uuid("Invalid interview ID"),
  questionDetails: z.array(evaluationItemSchema).min(1, "At least one question detail is required"),
  feedbackInterviewer: z.record(z.string(), z.any()).optional(),
  feedbackCandidate: z.record(z.string(), z.any()).optional(),
  relevancyAI: z.number().optional(),
  relevancyCandidate: z.number().optional(),
  idealAnswerAI: z.record(z.string(), z.any()).optional(),
  marksAI: z.number().optional(),
});



/// Create Evaluation
export const createEvaluation = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = createEvaluationSchema.parse(req.body);

    const newEvaluation = await prisma.evaluation.create({
      data: validatedData,
    });

    res.status(201).json({
      success: true,
      message: "Evaluation created successfully",
      data: newEvaluation,
    });
  } catch (error) {
    console.error("Error in createEvaluation:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};
const updateEvaluationSchema = createEvaluationSchema.partial();
/// Get All Evaluations
export const getEvaluations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: { interview: true },
    });

    res.status(200).json({
      success: true,
      message: "Evaluations fetched successfully",
      data: evaluations,
    });
  } catch (error) {
    console.error("Error in getEvaluations:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/// Get Evaluations By Interview ID
export const getEvaluationsByInterviewId = async (req: Request, res: Response): Promise<void> => {
  const { interviewId } = req.params;

  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { interviewId },
      include: { interview: true },
    });

    if (!evaluations.length) {
      res.status(404).json({
        success: false,
        message: `No evaluations found for interview ID: ${interviewId}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Evaluations fetched successfully",
      data: evaluations,
    });
  } catch (error) {
    console.error("Error in getEvaluationsByInterviewId:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/// Update Evaluation
export const updateEvaluation = async (req: Request, res: Response): Promise<void> => {
  const { evaluationId } = req.params;

  try {
    const validatedData = updateEvaluationSchema.parse(req.body);

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: validatedData,
    });

    res.status(200).json({
      success: true,
      message: "Evaluation updated successfully",
      data: updatedEvaluation,
    });
  } catch (error) {
    console.error("Error in updateEvaluation:", error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

/// Delete Evaluation
export const deleteEvaluation = async (req: Request, res: Response): Promise<void> => {
  const { evaluationId } = req.params;

  try {
    await prisma.evaluation.delete({
      where: { id: evaluationId },
    });

    res.status(200).json({
      success: true,
      message: "Evaluation deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteEvaluation:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
