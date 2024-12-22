# API Documentation

### Get Trains Based On Certain Crieteria

**Endpoint:**  
`https://district12.xyz/api/trains/get`

**Local Dev Endpoint:**  
`http://localhost:8005/api/trains/get`

**Method:**  
`POST`

**Body:**

```json
{
  "from_station_name": "Dhaka",
  "to_station_name": "Khulna",
  "date": "2024-10-25"
}
```

**Response:**

**Status Code: 201**

**Returns an array of trains**

```json
{
  [
    {
        "train_id": "0c355a51-ebb3-4082-a262-703a09273801",
        "train_name": "A",
        "departure_time": "10:00:00"
    },
    {
        "train_id": "0c355a51-ebb3-4082-a262-703a09273802",
        "train_name": "B",
        "departure_time": "11:00:00"
    }
  ]
}
```

**Invalid Request:**

**Status Code: 405**

```json
{
  "error": "Invalid request method."
}
```

**Error:**

**Status Code: 400**

```json
{
  "error": "error message"
}
```
