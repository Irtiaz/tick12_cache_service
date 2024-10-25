// redisClient.js
//const { createClient } = require("redis");

// Create a Redis client
//const client = createClient({
//	socket: {
//		port: 6379, // Redis port
//		host: "localhost", // Redis host
//	},
//});

const Redis = require('ioredis');

let client = null;

if (client == null) {
  client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });
  console.log('redis connected');
}

/*
const client = new Redis({
	port: 6379,
	host: "localhost",
});
*/

// Connect to Redis

// client.on("connect", () => {
//   console.log("Connected to Redis");
// });

module.exports = { client };
