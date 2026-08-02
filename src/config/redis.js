const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

// Connection Events
redisClient.on("connect", () => {
    console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
    console.log("Redis connected successfully");
});

redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});

redisClient.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});

redisClient.on("end", () => {
    console.log("Redis connection closed");
});

/**
 * Connect to Redis
 */
async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
}

module.exports = connectRedis;
module.exports.redisClient = redisClient;