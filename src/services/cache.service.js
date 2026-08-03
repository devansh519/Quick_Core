const { redisClient } = require("../config/redis");

class CacheService {

    /**
     * True only when Redis is connected and ready to accept commands.
     *
     * When Redis is unavailable, every cache operation becomes a safe
     * no-op (logged) so the API keeps working with MongoDB as the
     * source of truth. Without this guard, node-redis would buffer
     * commands forever against a disconnected client.
     */
    _isReady() {
        return Boolean(redisClient && redisClient.isReady);
    }

    /**
     * Get value from Redis
     * @param {string} key
     * @returns {Promise<any | null>}
     */
    async get(key) {
        if (!this._isReady()) {
            console.error("[Cache] Redis unavailable - skipping get:", key);
            return null;
        }

        try {
            const value = await redisClient.get(key);

            if (!value) {
                return null;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error("[Cache] Redis get failed:", error);
            return null;
        }
    }

    /**
     * Store value in Redis
     * @param {string} key
     * @param {any} value
     * @param {number} ttl Time To Live (seconds)
     */
    async set(key, value, ttl = 600) {
        if (!this._isReady()) {
            console.error("[Cache] Redis unavailable - skipping set:", key);
            return;
        }

        try {
            await redisClient.set(
                key,
                JSON.stringify(value),
                {
                    EX: ttl,
                }
            );
        } catch (error) {
            console.error("[Cache] Redis set failed:", error);
        }
    }

    /**
     * Delete a cache key
     * @param {string} key
     */
    async del(key) {
        if (!this._isReady()) {
            console.error("[Cache] Redis unavailable - skipping del:", key);
            return;
        }

        try {
            await redisClient.del(key);
        } catch (error) {
            console.error("[Cache] Redis del failed:", error);
        }
    }

    /**
     * Check if key exists
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async exists(key) {
        if (!this._isReady()) {
            return false;
        }

        try {
            const exists = await redisClient.exists(key);
            return exists === 1;
        } catch (error) {
            console.error("[Cache] Redis exists failed:", error);
            return false;
        }
    }

    /**
     * Set expiration time on existing key
     * @param {string} key
     * @param {number} ttl
     */
    async expire(key, ttl) {
        if (!this._isReady()) {
            return;
        }

        try {
            await redisClient.expire(key, ttl);
        } catch (error) {
            console.error("[Cache] Redis expire failed:", error);
        }
    }

    /**
     * Get remaining TTL
     * @param {string} key
     * @returns {Promise<number>}
     */
    async ttl(key) {
        if (!this._isReady()) {
            return -2;
        }

        try {
            return await redisClient.ttl(key);
        } catch (error) {
            console.error("[Cache] Redis ttl failed:", error);
            return -2;
        }
    }

    /**
     * Delete multiple keys
     * @param {string[]} keys
     */
    async delMany(keys) {
        if (!keys.length) {
            return;
        }

        if (!this._isReady()) {
            console.error("[Cache] Redis unavailable - skipping delMany");
            return;
        }

        try {
            await redisClient.del(keys);
        } catch (error) {
            console.error("[Cache] Redis delMany failed:", error);
        }
    }

    /**
     * Flush entire Redis database
     * Useful for testing only
     */
    async flush() {
        if (!this._isReady()) {
            return;
        }

        try {
            await redisClient.flushDb();
        } catch (error) {
            console.error("[Cache] Redis flush failed:", error);
        }
    }
}

module.exports = new CacheService();
