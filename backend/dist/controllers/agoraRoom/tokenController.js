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
exports.generateToken = void 0;
const agora_access_token_1 = require("agora-access-token");
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appId, appCertificate, channelName, uid } = req.body;
        if (!appId || !appCertificate || !channelName || !uid) {
            return res.status(400).json({
                error: 'appId, appCertificate, channelName, and uid are required'
            });
        }
        const parsedUid = Number(uid);
        if (isNaN(parsedUid)) {
            return res.status(400).json({
                error: 'uid must be a valid number'
            });
        }
        const rtcRole = agora_access_token_1.RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600 * 24;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, parsedUid, rtcRole, privilegeExpireTime);
        return res.json({
            token,
            expiresAt: new Date(currentTimestamp * 1000 + expirationTimeInSeconds * 1000)
        });
    }
    catch (error) {
        console.error('Token generation error:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return res.status(500).json({
            success: false,
            error: 'Failed to generate token',
            details: errorMessage
        });
    }
});
exports.generateToken = generateToken;
