"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAWS = exports.getObjectURL = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIAZQ3DUIAPWJOBAOE5",
        secretAccessKey: "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",
    },
});
const getObjectURL = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: 'skillmatrix-private-1',
        Key: key,
    });
    const url = (0, s3_request_presigner_1.getSignedUrl)(s3, command);
    console.log(url);
    return url;
});
exports.getObjectURL = getObjectURL;
const callAWS = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getObjectURL)('SIH_logo_2024.png');
});
exports.callAWS = callAWS;
exports.default = s3;
