import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { z } from "zod";

const prisma = new PrismaClient();

const markSchema = z.object({
    interviewerId: z.string().uuid("Invalid interviewer ID"),
    marks: z.number().min(0).max(10, "Marks should be between 0 and 10")
});
  
const evaluationItemSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    topic: z.string().min(1, "Topic cannot be empty"),
    marksGiven: z.array(markSchema).min(1, "At least one mark is required")
});
  
const createEvaluationSchema = z.object({
    interviewId: z.string().uuid("Invalid interview ID"),
    questionDetails: z.array(evaluationItemSchema),
    feedbackInterviewer: z.record(z.string(), z.any()).optional(),
    feedbackCandidate: z.record(z.string(), z.any()).optional(),
    relevancyAI: z.number().optional(),
    relevancyCandidate: z.number().optional(),
    idealAnswerAI: z.record(z.string(), z.any()).optional(),
    marksAI: z.number().optional()
});

const updateEvaluationSchema = createEvaluationSchema.partial();

export const createEvaluation = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = createEvaluationSchema.parse(req.body);

    const newEvaluation = await prisma.evaluation.create({
      data: {
        ...validatedData,
        questionDetails: validatedData.questionDetails as any,
        feedbackInterviewer: validatedData.feedbackInterviewer as any,
        feedbackCandidate: validatedData.feedbackCandidate as any,
        idealAnswerAI: validatedData.idealAnswerAI as any
      }
    });

    res.status(201).json({
      success: true,
      message: "Evaluation created successfully",
      data: newEvaluation
    });
  } catch (error) {
    console.error("Error in createEvaluation:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error",
        errors: error.errors 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

export const getEvaluations = async (req: Request, res: Response): Promise<any> => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      include: {
        interview: true 
      }
    });

    res.status(200).json({
      success: true,
      message: "Evaluations fetched successfully",
      data: evaluations
    });
  } catch (error) {
    console.error("Error in getEvaluations:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};


export const getEvaluationsByInterviewId = async (req: Request, res: Response): Promise<any> => {
    const { interviewId } = req.params;
  
    try {
      const evaluations = await prisma.evaluation.findMany({
        where: { 
          interviewId: interviewId 
        },
        include: {
          interview: true 
        }
      });
  
      if (evaluations.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "No evaluations found for this interview" 
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Evaluations fetched successfully",
        data: evaluations
      });
    } catch (error) {
      console.error("Error in getEvaluationsByInterviewId:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
};



export const updateEvaluation = async (req: Request, res: Response): Promise<any> => {
  const { evaluationId } = req.params;

  try {
    const validatedData = updateEvaluationSchema.parse(req.body);

    const updatedEvaluation = await prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        ...validatedData,
        questionDetails: validatedData.questionDetails as any,
        feedbackInterviewer: validatedData.feedbackInterviewer as any,
        feedbackCandidate: validatedData.feedbackCandidate as any,
        idealAnswerAI: validatedData.idealAnswerAI as any
      }
    });

    res.status(200).json({
      success: true,
      message: "Evaluation updated successfully",
      data: updatedEvaluation
    });
  } catch (error) {
    console.error("Error in updateEvaluation:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: "Validation Error",
        errors: error.errors 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

export const deleteEvaluation = async (req: Request, res: Response): Promise<any> => {
  const { evaluationId } = req.params;

  try {
    await prisma.evaluation.delete({
      where: { id: evaluationId }
    });

    res.status(200).json({
      success: true,
      message: "Evaluation deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteEvaluation:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};