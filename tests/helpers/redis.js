const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', err => console.log('Redis Client Error', err));
        this.client.connect();
    }

    async setValue(key, value, ttlSeconds) {
        await this.client.set(key, value);
        await this.client.expire(key, ttlSeconds);
        await this.client.disconnect();
    }

    async getValue(key) {
        const keyValue = await this.client.get(key);
        await this.client.disconnect();
        return keyValue;
    }
}

module.exports = { RedisClient };
