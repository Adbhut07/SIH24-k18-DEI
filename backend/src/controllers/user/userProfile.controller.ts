import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema using Zod
const candidateProfileSchema = z.object({
  candidateId: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().optional(),
  age: z.number().int().min(18, 'Age must be at least 18').max(100, 'Age must be below 100').optional(),
  location: z.string().optional(),
  aadharNumber: z.string().length(12, 'Aadhar number must be 12 digits').optional(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits').optional(),
  summary: z.string().optional(),
  resume: z.string().url('Invalid resume URL').optional(),
  medicalReport: z.string().url('Invalid medical report URL').optional(),
  tenthMarks: z.string().optional(),
  twelfthMarks: z.string().optional(),
  gateScore: z.string().optional(),
  jeeScore: z.string().optional(),
  experience: z.any().optional(), 
  education: z.any().optional(), 
  skills: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

export const createCandidateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const validatedData = candidateProfileSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: validatedData.candidateId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    if (user.role !== 'CANDIDATE') {
      return res.status(400).json({ success: false, message: 'User is not a candidate' });
    }

    const candidateProfile = await prisma.candidateProfile.create({
      data: validatedData,
    });

    return res.status(201).json({ success: true, data: candidateProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors,
      });
    }

    console.error('Error creating candidate profile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const getCandidateProfileByEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.params;

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { 
        email: email,
       },
      include: { candidate: true }, 
    });

    if (!candidateProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    return res.status(200).json({ success: true, data: candidateProfile });
  } catch (error) {
    console.error('Error in getCandidateProfile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


const updateCandidateProfileSchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  age: z.number().int().min(18).max(100).optional(),
  location: z.string().optional(),
  aadharNumber: z.string().length(12).optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().regex(/^\d{10}$/).optional(),
  summary: z.string().optional(),
  resume: z.string().url().optional(),
  medicalReport: z.string().url().optional(),
  tenthMarks: z.string().optional(),
  twelfthMarks: z.string().optional(),
  gateScore: z.string().optional(),
  jeeScore: z.string().optional(),
  experience: z.any().optional(),
  education: z.any().optional(),
  skills: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
});

export const updateCandidateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const updateData = updateCandidateProfileSchema.parse(req.body);

    const existingProfile = await prisma.candidateProfile.findUnique({ where: { id } });
    if (!existingProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    const updatedProfile = await prisma.candidateProfile.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    console.error('Error in updateCandidateProfile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const deleteCandidateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const existingProfile = await prisma.candidateProfile.findUnique({ where: { id } });
    if (!existingProfile) {
      return res.status(404).json({ success: false, message: 'Candidate profile not found' });
    }

    await prisma.candidateProfile.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Candidate profile deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCandidateProfile:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
