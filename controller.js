const crypto = require("crypto");
const { client } = require("./redisClient"); // Import the Redis client
const { default: Redlock } = require("redlock");

const redlock = new Redlock([client], {
	driftFactor: 0.01,
	retryCount: -1,
	retryDelay: 200,
	retryJitter: 200,
});

// Function to generate a unique hash from the input values
const generateHash = (trainId, seatNumber, date, time) => {
	const hash = crypto.createHash("sha256");
	console.log(`${trainId}-${seatNumber}-${date}-${time}`);
	hash.update(`${trainId}-${seatNumber}-${date}-${time}`);
	return hash.digest("hex");
};

// Controller function to handle seat booking
const bookSeat = async (req, res) => {
	const { train_id, seat_number, date, time } = req.body;

	// Generate a unique hash for the booking
	const uniqueValue = generateHash(train_id, seat_number, date, time);
	console.log(`Generated unique value: ${uniqueValue}`); // Log the unique value

	try {
		const rlock =	await acquireLock(uniqueValue, 1000);
		console.log("acquired rlock");

		// Check if the unique value already exists in Redis
		const reply = await client.sismember("booked_seats", uniqueValue);
		console.log(`sIsMember reply: ${reply}`); // Log the reply from Redis

		await releaseLock(rlock);
		console.log(`released rlock - ${rlock}`);

		if (reply) {
			// Check if the seat is already booked
			return res
				.status(400)
				.json({ message: "Booking unsuccessful: Seat already booked", success: false });
		} else {
			const wlock = await acquireLock(uniqueValue, 1000);
			console.log("Acquired wlock");
			// Add the unique value to the Redis set
			await client.sadd("booked_seats", uniqueValue);
			// Also store the seat number in a separate set
			await client.sadd(
				`booked_seats:${train_id}:${date}:${time}`,
				seat_number
			);

			// await releaseLock(key, value);
			//await wlock.releaseLock();
			//await wlock.releaseLock();
			await releaseLock(wlock);
			console.log(`Added to booked_seats: ${uniqueValue}`); // Log the addition
			return res.status(200).json({ message: "Booking successful", success: true });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error", sucess: null });
	}
};


// Controller function to handle seat cancellation
const cancelSeat = async (req, res) => {
	const { train_id, seat_number, date, time } = req.body;

	// Generate a unique hash for the booking
	const uniqueValue = generateHash(train_id, seat_number, date, time);
	console.log(`Generated unique value for cancellation: ${uniqueValue}`); // Log the unique value

	try {
		// Acquire a lock for the cancellation process
		const rlock = await acquireLock(uniqueValue, 1000);
		console.log("Acquired rlock for cancellation");

		// Check if the unique value exists in Redis (i.e., the seat is booked)
		const reply = await client.sismember("booked_seats", uniqueValue);
		console.log(`sIsMember reply for cancellation: ${reply}`); // Log the reply from Redis

		await releaseLock(rlock);
		console.log(`Released rlock for cancellation - ${rlock}`);

		if (!reply) {
			// Check if the seat is not booked
			return res.status(400).json({ message: "Cancellation unsuccessful: Seat not booked", success: false });
		} else {
			// Acquire a lock for making the cancellation
			const wlock = await acquireLock(uniqueValue, 1000);
			console.log("Acquired wlock for cancellation");

			// Remove the unique value from the Redis set (cancel the booking)
			await client.srem("booked_seats", uniqueValue);
			// Also remove the seat number from the specific train/date/time set
			await client.srem(`booked_seats:${train_id}:${date}:${time}`, seat_number);

			// Release the lock after cancellation
			await releaseLock(wlock);
			console.log(`Cancelled booking for: ${uniqueValue}`); // Log the removal

			return res.status(200).json({ message: "Cancellation successful", success: true });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error", success: null });
	}
};

const getBookedSeats = async (req, res) => {
	const { train_id, date, time } = req.query; // Get parameters from query string

	try {
		// Retrieve booked seat numbers from Redis
		const bookedSeats = await client.smembers(
			`booked_seats:${train_id}:${date}:${time}`
		);

		if (bookedSeats.length > 0) {
			return res.status(200).json({ bookedSeats });
		} else {
			return res
				.status(404)
				.json({ message: "No seats booked for the given criteria" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Server error" });
	}
};

// const isSeatBooked = async (req, res) => {
//   const { train_id, date, time, seat_number } = req.query;

//   try {
//     // Retrieve booked seat numbers from Redis
//     const bookedSeats = await client.sMembers(
//       `booked_seats:${train_id}:${date}:${time}`
//     );

//     if (bookedSeats.includes(seat_number)) {
//       return res.status(200).json({ message: "Seat is booked" });
//     } else {
//       return res.status(200).json({ message: "Seat is not booked" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

async function acquireLock(resource, ttl) {
	/*
	const retryDelay = 100;

	while (true) {
		const result = await client.set(key, value, "NX", "PX", ttl);
		if (result === "OK") {
			console.log(`Lock acquired for key: ${key}`);
			return;
		} else {
			console.log(`Lock already held for ${key}`);
			await new Promise((resolve) => setTimeout(resolve, retryDelay));
		}
	}
	*/
	console.log(`Going for lock - ${resource}`);

	const rlock = await redlock.acquire([resource], ttl);
	console.log("successfully called redlock.acquire");
	console.log(`Lock acquired for resource: ${resource}`);
	return rlock;
}

async function releaseLock(lock) {
	console.log("Going to release a lock");
	await lock.release();
	console.log(`Lock released`);
	/*
	const script = `
		if redis.call("get", KEYS[1]) == ARGV[1] then
			return redis.call("del", KEYS[1])
		else
			return 0
		end
	`;
	const result = await client.eval(script, 1, String(key), String(value));
	if (result === 1) {
		console.log(`Lock released for key: ${key}`);
	} else {
		console.log(`Failed to release lock for key: ${key}`);
	}
	*/
}

module.exports = { bookSeat, getBookedSeats, cancelSeat };
