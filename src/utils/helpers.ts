import { ITicketUpdateData } from '@/interface';

const SESSION_SECRETS_KEY = 'tc_session_secrets';

export function getAllBoughtTickets(tickets: ITicketUpdateData[]) {
    return tickets?.filter((x) => x.bought);
}

export function saveSessionSecret(sessionId: string, secret: string): void {
    try {
        const map = JSON.parse(localStorage.getItem(SESSION_SECRETS_KEY) || '{}');
        map[sessionId] = secret;
        localStorage.setItem(SESSION_SECRETS_KEY, JSON.stringify(map));
    } catch {
        // localStorage unavailable — ignore
    }
}

export function getSessionSecret(sessionId: string | undefined): string {
    if (!sessionId) return '';
    try {
        const map = JSON.parse(localStorage.getItem(SESSION_SECRETS_KEY) || '{}');
        return map[sessionId] || '';
    } catch {
        return '';
    }
}
