class RedisSessionStore {
    constructor(client) {
        this.client = client;
    }

    async get(sessionId) {
        const id = buildSessionId(sessionId);
        const data = await this.client.get(id);
        if (!data) {
            return null;
        }

        try {
            return JSON.parse(data);
        } catch (err) {
            console.error(err);
        }
    }

    async set(sessionId, SessionContent, timeLimit) {
        const id = buildSessionId(sessionId);
        if (typeof timeLimit === 'number') {
            timeLimit = Math.ceil(timeLimit / 1000);
        }

        try {
            const content = JSON.stringify(SessionContent);
            if (timeLimit) {
                await this.client.setex(id, timeLimit, content);
            } else {
                await this.client.set(id, content);
            }
        } catch (err) {
            console.error(err);
        }
        console.log('Set successfully')
    }

    async destroy(sessionId) {
        const id = buildSessionId(sessionId);
        await this.client.del(id)
    }
}

function buildSessionId(sessionId) {
    return `ssid:${sessionId}`;
}

module.exports = RedisSessionStore;