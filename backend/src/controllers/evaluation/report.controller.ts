import { z } from "zod";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getEvaluationByInterviewer = async (
  req: Request,
  res: Response
):Promise<any> => {
  const { interviewId, interviewerId } = req.params;

  try {
    // Validate input parameters
    if (!interviewId || !interviewerId) {
      return res
        .status(400)
        .json({ message: "interviewId and interviewerId are required." });
    }

    // Fetch evaluation record from the database
    const evaluation = await prisma.evaluation.findUnique({
      where: { interviewId },
    });

    if (!evaluation) {
      return res
        .status(404)
        .json({
          message: "Evaluation not found for the provided interviewId.",
        });
    }

    const questionDetails = evaluation.questionDetails as unknown as Array<any>;

    if (!questionDetails) {
      return res.status(200).json([]); // Return an empty array if questionDetails is null
    }

    const filteredQuestions = questionDetails.filter((question) =>
        question.marks_given_by_interviewers.some(
          (mark: any) => mark.interviewerId === interviewerId
        )
    );

    return res.status(200).json({
        success: true,
        message: "data fetched successfully",
        data: filteredQuestions
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching evaluation data.",
        error: (error as any).message,
      });
  }
};
