"use strict";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { S3 } from "aws-sdk"; // Import v2 S3 compatibility wrapper
// import dotenv from "dotenv";
// dotenv.config();
// const s3 = new S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });
// const bucketName = process.env.AWS_BUCKET_NAME;
// const upload = multer({
//   storage: multerS3({
//     s3: s3, // Pass the v2 S3 instance here
//     bucket: bucketName!,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       const timestamp = Date.now().toString();
//       cb(null, `uploads/${timestamp}-${file.originalname}`);
//     },
//   }),
// });
// export default upload;
