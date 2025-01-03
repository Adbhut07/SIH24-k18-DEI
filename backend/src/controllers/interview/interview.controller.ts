import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const createInterviewSessionSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  candidateId: z.string().nonempty("Candidate ID is required"),
  interviewerIds: z.array(z.string()).nonempty("At least one interviewer ID is required"),
  scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Scheduled date must be a valid ISO date",
  }),
  channelName: z.string()
});


const updateInterviewSessionSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid interview session ID."),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    scheduledAt: z.string().optional().refine((date) => date ? !isNaN(Date.parse(date)) : true, {
      message: "Scheduled date must be a valid ISO date",
    }),
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

  const { title, description, candidateId, interviewerIds, scheduledAt, channelName } = parseResult.data;

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

    const room = await prisma.room.findFirst({
      where: {
        channel: channelName,
        inUse: false,
      }
    })

    if(!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      })
    }

    const interview = await prisma.interview.create({
      data: {
        title,
        description,
        candidateId,
        scheduledAt: new Date(scheduledAt),
        interviewers: {
          create: interviewerIds.map((interviewerId) => ({
            interviewerId,
          })),
        },
        roomId: room.id,
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


    await prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        inUse: true,
      }
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully",
      data: {interview, room},
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
  const parseResult = updateInterviewSessionSchema.safeParse(req);

  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: parseResult.error.format(),
    });
  }

  const { id } = parseResult.data.params;
  const { title, description, scheduledAt } = parseResult.data.body;

  try {
    const updatedInterview = await prisma.interview.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Interview session updated successfully",
      interview: updatedInterview,
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

    if(req.body.status === "COMPLETED") {
      await prisma.room.update({
        where: {
          id: updatedStatus.roomId || "",
        },
        data: {
          inUse: false,
        }
      })
    }

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

export const getAllInterviews = async (req: Request, res: Response): Promise<any> => {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        candidate: true,
        interviewers: {
          include: {
            interviewer: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Fetched all interviews successfully.",
      data: interviews,
    });
  } catch (error: any) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interviews.",
      error: error.message || "An unexpected error occurred",
    });
  }
};



export const getInterviewById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const interview = await prisma.interview.findUnique({
      where: { id },
      include: {
        candidate: true,
        interviewers: {
          include: {
            interviewer: true,
          },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched interview successfully.",
      data: interview,
    });
  } catch (error: any) {
    console.error("Error fetching interview:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview.",
      error: error.message || "An unexpected error occurred",
    });
  }
};




// export const findInterviewByRoomId = async (roomId: string) => {
//   return await prisma.interview.findUnique({
//     where: { roomId },
//     include: {
//       candidate: true,
//       interviewers: {
//         include: { interviewer: true },
//       },
//     },
//   });
// };





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