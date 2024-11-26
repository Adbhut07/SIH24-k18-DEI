import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { Request, Response } from 'express';

const APP_ID = '8a17f1b47b6043a88cf582896718b905';
const APP_CERTIFICATE = 'f013f7cdbcb8458bbd915cc9cd01ae37';

export const generateToken =async (req: Request, res: Response):Promise<any> => {
    const channelName = req.query.channelName as string;
    const uid = parseInt(req.query.uid as string, 10);
    const { role } = req.query;

    if (!channelName || !uid) {
        return res.status(400).json({ error: 'Channel name and UID are required' });
    }

    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    const rtcRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        rtcRole,
        privilegeExpireTime
    );

    return res.json({ token });
};
