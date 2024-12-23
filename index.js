// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { bookSeat, getBookedSeats, cancelSeat } = require("./controller");

// const { pool } = require("./database/pool.js");
// const { sql, requestHandler } = require("./database/neon/pool.js");


const cors = require("cors");

const app = express();
const PORT = 8005;

// CORS options
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Log when attempting to start PostgreSQL
console.log("Trying to connect to PostgreSQL");

// Check the PostgreSQL connection
// pool.connect((err, client, release) => {
//   if (err) {
//     return console.error("Error acquiring client", err.stack);
//   }
//   console.log("Connected to PostgreSQL pool");
//   release(); // release the client back to the pool
// });

// requestHandler();

// Middleware
app.use(bodyParser.json());

const promMid = require("express-prometheus-middleware");
app.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
  })
);

// Endpoint for booking a seat
app.post("/api/book-seat", bookSeat);
app.post("/api/cancel-seat", cancelSeat);

// New endpoint for retrieving booked seats
app.get("/api/booked-seats", getBookedSeats);

// New endpoint for checking if a seat is booked
// app.get("/is-seat-booked", isSeatBooked);

// Start the server
app.listen(PORT, () => {
  console.log(`Cache service running on port ${PORT}`);
});
