# Backend API

## Register a user

Creates a new user account, stores a hashed version of the password, and returns an authentication token.

### Endpoint

```http
POST /user/register
```

When running the server locally on port `3000`, use:

```text
http://localhost:3000/user/register
```

### Headers

```http
Content-Type: application/json
```

### Required request body

Send the body as **raw JSON** in Postman.

```json
{
  "fullname": {
    "firstname": "Test",
    "lastname": "User"
  },
  "email": "test@example.com",
  "password": "test124"
}
```

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `fullname.firstname` | string | Yes | At least 3 characters |
| `fullname.lastname` | string | Yes | At least 3 characters |
| `email` | string | Yes | Must be a valid email address |
| `password` | string | Yes | At least 6 characters |

### Status codes

| Status code | Meaning | When it is returned |
| --- | --- | --- |
| `202 Accepted` | Registration successful | The user is created and a JWT token is returned. |
| `400 Bad Request` | Validation failed | The email, first name, or password does not meet the validation rules. |
| `500 Internal Server Error` | Server error | The database, JWT configuration, or another server operation fails. |

### Successful response (`202`)

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullname": {
      "firstname": "Test",
      "lastname": "User"
    },
    "email": "test@example.com"
  }
}
```

### Validation-error response (`400`)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Postman setup

1. Choose the `POST` method.
2. Enter `http://localhost:3000/user/register`.
3. Under **Body**, choose **raw** and select **JSON**.
4. Paste the required request body above and click **Send**.

## Login a user

Authenticate an existing user and return a JWT token.

### Endpoint

```http
POST /user/login
```

When running the server locally on port `3000`, use:

```text
http://localhost:3000/user/login
```

### Headers

```http
Content-Type: application/json
```

### Required request body

Send the body as **raw JSON** in Postman.

```json
{
  "email": "test@example.com",
  "password": "test124"
}
```

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `email` | string | Yes | Must be a valid email address |
| `password` | string | Yes | At least 6 characters |

### Status codes

| Status code | Meaning | When it is returned |
| --- | --- | --- |
| `200 OK` | Login successful | Valid credentials; returns a JWT token and user object. |
| `400 Bad Request` | Validation failed | The email or password does not meet validation rules. |
| `401 Unauthorized` | Invalid credentials | Email not found or password mismatch. |
| `500 Internal Server Error` | Server error | The database, JWT configuration, or another server operation fails. |

### Successful response (`200`)

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullname": {
      "firstname": "Test",
      "lastname": "User"
    },
    "email": "test@example.com"
  }
}
```

### Validation-error response (`400`)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Unauthorized response (`401`)

```json
{
  "message": "Invalid email or password"
}
```

### Postman setup

1. Choose the `POST` method.
2. Enter `http://localhost:3000/user/login`.
3. Under **Body**, choose **raw** and select **JSON**.
4. Paste the required request body above and click **Send**.

## Get user profile

Returns the current authenticated user profile.

### Endpoint

```http
GET /user/profile
```

When running the server locally on port `3000`, use:

```text
http://localhost:3000/user/profile
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Status codes

| Status code | Meaning | When it is returned |
| --- | --- | --- |
| `200 OK` | Profile returned | Valid auth token and user exists. |
| `401 Unauthorized` | Authentication failed | Missing or invalid token. |
| `500 Internal Server Error` | Server error | Database or server failure. |

### Successful response (`200`)

```json
{
  "user": {
    "_id": "<user-id>",
    "fullname": {
      "firstname": "Test",
      "lastname": "User"
    },
    "email": "test@example.com"
  }
}
```

## Logout user

Invalidates the current authentication token and clears the token cookie.

### Endpoint

```http
GET /user/logout
```

When running the server locally on port `3000`, use:

```text
http://localhost:3000/user/logout
```

### Headers

```http
Authorization: Bearer <jwt-token>
```

### Status codes

| Status code | Meaning | When it is returned |
| --- | --- | --- |
| `200 OK` | Logout successful | Token is added to blacklist and cookie cleared. |
| `401 Unauthorized` | Authentication failed | Missing or invalid token. |
| `500 Internal Server Error` | Server error | Database or server failure. |

### Successful response (`200`)

```json
{
  "message": "Logged out successfully"
}
```

---

# Captain API & Module Documentation

This section documents all endpoints, data models, services, and controller logic related to **Captain** (Driver) management.

## Architectural Overview

The Captain module follows a layered Node.js/Express architecture:

```
                  ┌──────────────────────┐
                  │    HTTP Request      │
                  └──────────┬───────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [app.js] Mounts '/captain' router                      │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [captain.routes.js] express-validator request checks    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [captain.controller.js] Handles HTTP req/res & auth JWT │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [captain.service.js] Business logic & DB object creation│
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [captain.model.js] Mongoose schema & auth methods       │
└─────────────────────────────────────────────────────────┘
```

---

## Register a Captain

Creates a new Captain account with vehicle details, hashes the password, creates the DB record, and returns a JWT auth token.

### Endpoint

```http
POST /captain/register
```

When running the server locally on port `3000`, use:

```text
http://localhost:3000/captain/register
```

### Headers

```http
Content-Type: application/json
```

### Required Request Body

Send the body as **raw JSON** in Postman or cURL:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "captain@example.com",
  "password": "password123",
  "vehicleColor": "Black",
  "vehiclePlateNumber": "NY-1234",
  "vehicleCapacity": 4,
  "vehicleType": "car"
}
```

### Body Parameter Validation Rules

| Field | Type | Required | Validation Rules |
| --- | --- | --- | --- |
| `fullname.firstname` | string | Yes | At least 3 characters long |
| `fullname.lastname` | string | No | At least 3 characters long (if provided) |
| `email` | string | Yes | Must be a valid email format (`/\S+@\S+\.\S+/`), unique in DB |
| `password` | string | Yes | Minimum 6 characters long |
| `vehicleColor` | string | Yes | Cannot be empty, minimum 3 characters long |
| `vehiclePlateNumber` | string | Yes | Cannot be empty, minimum 3 characters long |
| `vehicleCapacity` | integer | Yes | Integer greater than or equal to 1 |
| `vehicleType` | string | Yes | Allowed enum values: `["car", "bike", "auto", "van"]` |

---

### Response Status Codes

| Status Code | Meaning | Cause / Description |
| --- | --- | --- |
| `201 Created` | Captain registered successfully | Database document created and JWT returned |
| `400 Bad Request` | Validation or duplication error | Input fails validation or email already exists |
| `500 Internal Server Error` | Server error | Database connection failure or runtime exception |

### Successful Response (`201 Created`)

```json
{
  "message": "Captain registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validation Error Response (`400 Bad Request`)

```json
{
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Duplicate Email Response (`400 Bad Request`)

```json
{
  "message": "Captain with this email already exists"
}
```

---

## Technical File Reference

### 1. Model: `models/captain.model.js`
- **Mongoose Schema**: `captainSchema`
- **Fields**:
  - `fullname`: `{ firstname: String, lastname: String }`
  - `email`: `String` (lowercase, unique, indexed)
  - `password`: `String` (hidden by default via `select: false`)
  - `sockerId`: `String` (Socket.io connection ID for real-time tracking)
  - `status`: `String` (enum: `['active', 'inactive']`, default: `'inactive'`)
  - `vehicle`: `{ color: String, plateNumber: String, capacity: Number, vehicleType: String }`
  - `location`: `{ latitude: Number, longitude: Number }` (Geolocation tracking)
- **Methods & Statics**:
  - `generateAuthToken()`: Returns a JWT signed with `process.env.JWT_SECRET` (24h expiry).
  - `comparePassword(password)`: Asynchronously compares input password with stored bcrypt hash.
  - `hashPassword(password)`: Static helper to hash passwords using bcrypt (10 rounds).

### 2. Service: `services/captain.service.js`
- `registerCaptain(options)`: Accepts destructured properties (`firstname`, `lastname`, `email`, `password`, `vehicleColor`, `vehiclePlateNumber`, `vehicleCapacity`, `vehicleType`). Performs strict null checks and creates the document in MongoDB via `captainModel.create()`.

### 3. Controller: `controllers/captain.controller.js`
- `registerCaptain(req, res)`:
  1. Evaluates express-validator results.
  2. Verifies if email already exists in DB (`captainModel.findOne`).
  3. Hashes the password using `bcrypt.hash`.
  4. Calls `captainService.registerCaptain()`.
  5. Generates a signed JWT token (`expiresIn: '1h'`).
  6. Sends HTTP 201 with success message and JWT token.

### 4. Routes: `routes/captain.routes.js`
- Defines `POST /register` with inline validation middleware using `express-validator`.

### 5. Application Entry: `app.js`
- Mounts Captain routes:
  ```js
  app.use('/captain', captainRoutes);
  ```

