import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => {
    throw new Error("Redis Client Error: " + err)
});

(async() => {
    await redisClient.connect();
    console.log("Successfully connected to Redis ✅")
})();

export default redisClient