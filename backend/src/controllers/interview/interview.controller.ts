import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

const createInterviewSessionSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  candidateId: z.string().nonempty("Candidate ID is required"),
  interviewerIds: z.array(z.string()).nonempty("At least one interviewer ID is required"),
  scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Scheduled date must be a valid ISO date",
  }),
  usePredefined: z.boolean().optional(),
});

const updateInterviewSessionSchema = z.object({
  interviewId: z.string().nonempty("Interview ID is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  scheduledAt: z.string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Scheduled date must be a valid ISO date",
    }),
  usePredefined: z.boolean().optional(),
  addInterviewerIds: z.array(z.string()).optional(),
  removeInterviewerIds: z.array(z.string()).optional(),
});


export const createInterviewSession = async (req: Request, res: Response): Promise<any> => {
  const parseResult = createInterviewSessionSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.format();
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors,
    });
  }

  const { title, description, candidateId, interviewerIds, scheduledAt, usePredefined } = parseResult.data;

  try {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    if (candidate.role !== "CANDIDATE") {
      return res.status(403).json({ success: false, message: "Specified user is not a candidate" });
    }

    const interviewers = await prisma.user.findMany({
      where: {
        id: { in: interviewerIds },
        role: "INTERVIEWER",
      },
    });

    if (interviewers.length !== interviewerIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more interviewers not found or invalid role",
      });
    }

    const interview = await prisma.interview.create({
      data: {
        title,
        description,
        candidateId,
        scheduledAt: new Date(scheduledAt),
        usePredefined: usePredefined ?? false,
        interviewers: {  
          create: interviewerIds.map((interviewerId) => ({
            interviewerId,
          })),
        },
      },
      include: {
        candidate: true,
        interviewers: {  
          include: {
            interviewer: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully",
      interview,
    });
  } catch (error: any) {
    console.error("Error creating interview session:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "An unexpected error occurred",
    });
  }
};


export const updateInterviewSession = async (req: Request, res: Response): Promise<any> => {
  const parseResult = updateInterviewSessionSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errors = parseResult.error.format();
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors,
    });
  }

  const {
    interviewId,
    title,
    description,
    scheduledAt,
    usePredefined,
    addInterviewerIds = [],
    removeInterviewerIds = [],
  } = parseResult.data;

  try {
    const existingInterview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        interviewers: true,
      },
    });

    if (!existingInterview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (addInterviewerIds.length > 0) {
      const newInterviewers = await prisma.user.findMany({
        where: {
          id: { in: addInterviewerIds },
          role: "INTERVIEWER",
        },
      });

      if (newInterviewers.length !== addInterviewerIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more new interviewers not found or have invalid role",
        });
      }
    }

    const updatedInterview = await prisma.$transaction(async (tx) => {
      if (removeInterviewerIds.length > 0) {
        await tx.interviewInterviewer.deleteMany({
          where: {
            interviewId,
            interviewerId: {
              in: removeInterviewerIds,
            },
          },
        });
      }

      if (addInterviewerIds.length > 0) {
        await tx.interviewInterviewer.createMany({
          data: addInterviewerIds.map((interviewerId) => ({
            interviewId,
            interviewerId,
          })),
          skipDuplicates: true, 
        });
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (scheduledAt !== undefined) updateData.scheduledAt = new Date(scheduledAt);
      if (usePredefined !== undefined) updateData.usePredefined = usePredefined;

      const updated = await tx.interview.update({
        where: { id: interviewId },
        data: updateData,
        include: {
          candidate: true,
          interviewers: {
            include: {
              interviewer: true,
            },
          },
        },
      });

      return updated;
    });

    return res.status(200).json({
      success: true,
      message: "Interview session updated successfully",
      interview: updatedInterview,
    });

  } catch (error: any) {
    console.error("Error updating interview session:", error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "Conflict with existing data",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "An unexpected error occurred",
    });
  }
};

const canUpdateInterview = async (
  userId: string,
  interviewId: string
): Promise<boolean> => {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: {
      interviewers: {
        select: {
          interviewerId: true,
        },
      },
    },
  });

  if (!interview) return false;

  return interview.interviewers.some(
    (interviewer) => interviewer.interviewerId === userId
  );
};

export const checkInterviewUpdatePermissions = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const userId = req.user?.userId; 
  const { interviewId } = req.body;

  if (!userId || !interviewId) {
    return res.status(400).json({
      success: false,
      message: "Missing required information",
    });
  }

  try {
    const hasPermission = await canUpdateInterview(userId, interviewId);
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this interview",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking permissions",
    });
  }
};