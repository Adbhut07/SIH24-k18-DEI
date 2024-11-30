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
const APP_ID = '8a17f1b47b6043a88cf582896718b905';
const APP_CERTIFICATE = 'f013f7cdbcb8458bbd915cc9cd01ae37';
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const channelName = 'room721';
    const uid = 2882341273;
    const rtcRole = agora_access_token_1.RtcRole.PUBLISHER;
    if (!channelName || !uid) {
        return res.status(400).json({ error: 'Channel name and UID are required' });
    }
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;
    // const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, rtcRole, privilegeExpireTime);
    return res.json({ token });
});
exports.generateToken = generateToken;
