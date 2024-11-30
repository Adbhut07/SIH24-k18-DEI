import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { Request, Response } from 'express';

export const generateToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const {appId, appCertificate, channelName, uid
        } = req.body;

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

        const rtcRole = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600 * 24; 
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            parsedUid,
            rtcRole,
            privilegeExpireTime
        );

        return res.json({ 
            token,
            expiresAt: new Date(currentTimestamp * 1000 + expirationTimeInSeconds * 1000)
        });
    } catch (error) {
        console.error('Token generation error:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return res.status(500).json({ 
            success: false,
            error: 'Failed to generate token', 
            details: errorMessage 
        });
    }
};