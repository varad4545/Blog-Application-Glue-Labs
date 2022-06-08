
const Redis=require('redis')
const redisClient=Redis.createClient()
redisClient.connect();
module.exports=redisClient