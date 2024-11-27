// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({
//   region: "ap-south-1",
//   credentials: {
//     accessKeyId: "",
//     secretAccessKey: "/",
//   },
// });

// export const getObjectURL = async (key: string) => {
//   const command = new GetObjectCommand({
//     Bucket: 'skillmatrix-private-1',
//     Key: key,
//   });
//   const url = getSignedUrl(s3, command);
//   console.log(url);
//   return url;
// }

// export const callAWS = async () => {
//     await getObjectURL('SIH_logo_2024.png')
// }
// export default s3;
