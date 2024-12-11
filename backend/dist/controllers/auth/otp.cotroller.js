"use strict";
// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import zod from "zod";
// import nodemailer from "nodemailer";
// const prisma = new PrismaClient();
// // OTP request schema
// const requestOTPSchema = zod.object({
//   email: zod.string().email("Invalid email format"),
// });
// // OTP verification schema
// const verifyOTPSchema = zod.object({
//   email: zod.string().email("Invalid email format"),
//   otp: zod.string().length(6, "OTP must be 6 digits"),
// });
// // Utility function to generate OTP
// const generateOTP = (): string => Math.floor(100000 + Math.random() * 900000).toString();
// // Configure Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "your-email@gmail.com",
//     pass: "your-email-password",
//   },
// });
// // Controller to request OTP
// export const requestOTP = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const result = requestOTPSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }
//     const { email } = result.data;
//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     // Generate OTP and expiry
//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
//     // Store OTP in database
//     await prisma.otp.create({
//       data: {
//         email,
//         otp,
//         expiresAt,
//         isVerified: false,
//       },
//     });
//     // Send OTP via email
//     await transporter.sendMail({
//       from: "your-email@gmail.com",
//       to: email,
//       subject: "Your OTP for Login",
//       text: `Your OTP is: ${otp}`,
//     });
//     res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error("Error in requestOTP controller:", (error as Error).message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
// // Controller to verify OTP
// export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const result = verifyOTPSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid inputs",
//         errors: result.error.format(),
//       });
//     }
//     const { email, otp } = result.data;
//     // Fetch OTP from database
//     const otpRecord = await prisma.otp.findFirst({
//       where: { email, otp, isVerified: false },
//     });
//     if (!otpRecord) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }
//     // Check if OTP is expired
//     if (new Date() > otpRecord.expiresAt) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP has expired",
//       });
//     }
//     // Mark OTP as verified
//     await prisma.otp.update({
//       where: { id: otpRecord.id },
//       data: { isVerified: true },
//     });
//     // Fetch user and generate token (reuse existing logic)
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//     return generateTokenAndSetCookie(user, res);
//   } catch (error) {
//     console.error("Error in verifyOTP controller:", (error as Error).message);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
