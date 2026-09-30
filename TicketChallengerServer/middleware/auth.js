import crypto from 'crypto';
import { TicketingSession } from '../models/ticketingSession.model.js';

export function generateSecret() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashSecret(secret) {
    return crypto.createHash('sha256').update(secret).digest('hex');
}

export function verifySessionSecret(storedHash, secret) {
    if (!storedHash || !secret) return false;
    const expected = Buffer.from(storedHash, 'hex');
    const actual = Buffer.from(hashSecret(secret), 'hex');
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export const requireSessionSecret = async (req, res, next) => {
    const sessionId = req.params.id;
    const header = req.headers.authorization || '';
    const secret = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!sessionId || !secret) {
        return res.status(401).json({
            success: false,
            error: 'Missing session secret',
        });
    }

    try {
        const session = await TicketingSession.findById(sessionId).select('secretHash');

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found',
            });
        }

        if (!verifySessionSecret(session.secretHash, secret)) {
            return res.status(403).json({
                success: false,
                error: 'Invalid session secret',
            });
        }

        req.sessionDoc = session;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: 'Invalid session ID',
        });
    }
};
