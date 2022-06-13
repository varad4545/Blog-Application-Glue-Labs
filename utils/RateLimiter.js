const redisClient=require("./redisClient")

function rateLimiter({ secondsWindow, allowedHits }) {
  return async function (req, res, next) {
    const ip = (req.headers["x-forwarded-for"] || req.connection.remoteAddress).slice(0, 9);
    const requests = await redisClient.incr(ip);
    console.log("NUmber of requests made so far: ", requests);
    let ttl;
    if (requests === 1) {
      await redisClient.expire(ip, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redisClient.ttl(ip);
    }
    if (requests > allowedHits) {
      return res.status(503).json({
        response: "error",
        callsInMinute: requests,
        ttl,
      });
    } else {
      next();
    }
  };
}

module.exports = { rateLimiter };