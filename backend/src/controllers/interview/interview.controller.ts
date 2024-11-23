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
  rounds: z.array(
    z.object({
      name: z.string().nonempty("Round name is required"),
      scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Scheduled date for round must be a valid ISO date",
      }),
      details: z.string().optional(),
    })
  ).nonempty("At least one round is required"),
});


const updateInterviewSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid interview session ID."),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    schedule: z.date().optional(),
  }),
});


const updateInterviewStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid interview session ID."),
  }),
  body: z.object({
    status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]),
  }),
});


// i have not addded to check if a interview for same candidate is already esiist or not (I feel not needed)
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

  const { title, description, candidateId, interviewerIds, scheduledAt, usePredefined, rounds } = parseResult.data;

  try {
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
    });

    if (!candidate || candidate.role !== "CANDIDATE") {
      return res.status(404).json({ success: false, message: "Candidate not found or invalid role" });
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
        rounds: {
          create: rounds.map((round) => ({
            name: round.name,
            scheduledAt: new Date(round.scheduledAt),
            details: round.details,
            status: "SCHEDULED",
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
        rounds: true,
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
  const { id } = req.params;
  const { title, description, schedule } = req.body; 

  try {
    const updatedSession = await prisma.interview.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(schedule && { schedule }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Interview session updated successfully.",
      updatedSession,
    });
  } catch (error: any) {
    console.error("Error updating interview session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update interview session.",
      error: error.message,
    });
  }
};

export const updateInterviewStatus = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { status } = req.body; 

  if (!["SCHEDULED", "IN_PROGRESS", "COMPLETED"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status provided.",
    });
  }

  try {
    const updatedStatus = await prisma.interview.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Interview session status updated successfully.",
      updatedStatus,
    });
  } catch (error: any) {
    console.error("Error updating interview status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update interview session status.",
      error: error.message,
    });
  }
};


//************************************** Rounds *******************************  */

const RoundStatus = z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED"]);

const UpdateRoundDetailsSchema = z.object({
  params: z.object({
    interviewId: z.string().uuid("Invalid interview session ID"),
    roundId: z.string().uuid("Invalid round ID"),
  }),
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    scheduledAt: z.string().datetime("Invalid date format").optional(),
    status: RoundStatus.optional(),
  }),
});

const deleteRoundSchema = z.object({
  params: z.object({
    interviewId: z.string().uuid("Invalid interview session ID."),
    roundId: z.string().uuid("Invalid round ID."),
  }),
});

export const updateRoundDetails = async (req: Request, res: Response): Promise<any> => {
  const validatedRequest = UpdateRoundDetailsSchema.parse({
    params: req.params,
    body: req.body,
  });

  const { interviewId, roundId } = validatedRequest.params;
  const { name, scheduledAt, status } = validatedRequest.body;

  try {
    const round = await prisma.round.findFirst({
      where: { id: roundId, interviewId },
    });

    if (!round) {
      return res.status(404).json({
        success: false,
        message: "Round not found or does not belong to the specified interview.",
      });
    }

    const updatedRound = await prisma.round.update({
      where: { id: roundId },
      data: {
        ...(name && { name }),
        ...(scheduledAt && { scheduledAt }),
        ...(status && { status }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Round details updated successfully.",
      updatedRound,
    });
  } catch (error: any) {
    console.error("Error updating round details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update round details.",
      error: error.message,
    });
  }
};

export const deleteRound = async (req: Request, res: Response): Promise<any> => {
  const validatedRequest = deleteRoundSchema.parse({
    params: req.params,
  });

  const { interviewId, roundId } = validatedRequest.params;

  try {
    const round = await prisma.round.findFirst({
      where: { id: roundId, interviewId },
    });

    if (!round) {
      return res.status(404).json({
        success: false,
        message: "Round not found.",
      });
    }

    await prisma.round.delete({
      where: { id: roundId },
    });

    return res.status(200).json({
      success: true,
      message: "Round deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting round:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete round.",
      error: error.message,
    });
  }
};


const addRoundsSchema = z.object({
  params: z.object({
    interviewId: z.string().uuid("Invalid interview session ID."),
  }),
  body: z.object({
    rounds: z
      .array(
        z.object({
          name: z.string(),
          schedule: z.date(),
          status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
        })
      )
      .min(1, "At least one round must be provided."),
  }),
});

const getRoundsSchema = z.object({
  params: z.object({
    interviewId: z.string().uuid("Invalid interview session ID."),
  }),
});


export const addRoundsToInterview = async (req: Request, res: Response): Promise<any> => {
  const validatedRequest = addRoundsSchema.safeParse({params: req.params, body: req.body});

  if (!validatedRequest.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: validatedRequest.error.format(),
    });
  }

  const { interviewId } = validatedRequest.data.params;
  const { rounds } = validatedRequest.data.body;

  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    const createdRounds = await prisma.round.createMany({
      data: rounds.map((round: any) => ({
        ...round,
        interviewId,
      })),
    });

    return res.status(201).json({
      success: true,
      message: "Rounds added successfully.",
      createdRoundsCount: createdRounds.count,
    });
  } catch (error: any) {
    console.error("Error adding rounds to interview:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "An unexpected error occurred.",
    });
  }
};


export const getRoundsForInterview = async (req: Request, res: Response): Promise<any> => {
  const validatedRequest = getRoundsSchema.safeParse({params: req.params});

  if (!validatedRequest.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: validatedRequest.error.format(),
    });
  }

  const { interviewId } = validatedRequest.data.params;

  try {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    const rounds = await prisma.round.findMany({
      where: { interviewId },
      orderBy: { scheduledAt: "asc" },
    });

    return res.status(200).json({
      success: true,
      message: "Rounds fetched successfully.",
      rounds,
    });
  } catch (error: any) {
    console.error("Error fetching rounds for interview:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message || "An unexpected error occurred.",
    });
  }
};





// not need currently
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