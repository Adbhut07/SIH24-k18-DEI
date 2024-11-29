"use server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType } = await req.json();
    
    if (!fileName) {
      throw new Error("fileName is required");
    }
    const sanitizedFileName = fileName.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    console.log("fileName:", sanitizedFileName);

    const key = `${uuidv4()}-${sanitizedFileName}`;

    const params = {
      Bucket: "skillmatrix-private-1",
      Key: key,
      ContentType: fileType,
    };

    const uploadUrl = await getSignedUrl(s3Client, new PutObjectCommand(params), {
      expiresIn: 3600, // URL expiration time in seconds
    });

    console.log("Upload URL:", uploadUrl);

    // const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}

