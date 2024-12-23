# API Documentation

### Book Seat
**Endpoint:**  
`https://district12.xyz/cache/api/book-seat`

**Local Dev Endpoint:**  
`http://localhost:8005/api/book-seat`

**Method:**  
`POST`

**Body:**
```json
{
  "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
  "seat_number": "Khulna",
  "date": "2024-10-25",
  "time": "11:00:00",
}
```

**Response on Success:**

**Status Code: 200**
```json
{
  "message": "Booking successful",
  "success": true,
}
```

**Response on Failure:**

**Status Code: 400**
```json
{
  "message": "Booking unsuccessful: Seat already booked",
  "success": false,
}
```

**Error:**

**Status Code: 500**
```json
{
  "message": "Server error",
  "success": null,
}
```

### Cancel Seat
**Endpoint:**  
`https://district12.xyz/cache/api/cancel-seat`

**Local Dev Endpoint:**  
`http://localhost:8005/api/cancel-seat`

**Method:**  
`POST`

**Body:**
```json
{
  "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
  "seat_number": "Khulna",
  "date": "2024-10-25",
  "time": "11:00:00",
}
```

**Response on Success:**

**Status Code: 200**
```json
{
  "message": "Cancellation successful",
  "success": true,
}
```

**Response on Failure:**

**Status Code: 400**
```json
{
  "message": "Cancellation unsuccessful: Seat not booked",
  "success": false,
}
```

**Error:**

**Status Code: 500**
```json
{
  "message": "Server error",
  "success": null,
}
```

### Retrieving booked seats
**Endpoint:**  
`https://district12.xyz/cache/api/booked-seats`

**Local Dev Endpoint:**  
`http://localhost:8005//api/booked-seats`

**Method:**  
`GET`

**Parameters:**
```json
{
  "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
  "date": "2024-10-25",
  "time": "11:00:00",
}
```

**Response on Success:**

**Status Code: 200**
```json
{
  "bookedSeats": "Cancellation successful",
}
```

**Response on Failure:**

**Status Code: 404**
```json
{
  "message": "No seats booked for the given criteria",
}
```

**Error:**

**Status Code: 500**
```json
{
  "message": "Server error",
  "success": null,
}
```