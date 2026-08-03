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

# # Captain API & Module Documentation

This section documents all endpoints, data models, services, controllers, and middleware related to **Captain** (Driver) management.

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
│ [captain.routes.js] express-validator & authMiddleware  │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [middlewares/auth.middleware.js] authCaptain Check     │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│ [captain.controller.js] Handles HTTP req/res & Auth     │
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
└────────────────────────────┬────────────────────────────┘
```

---

## 1. Register a Captain

Creates a new Captain account with vehicle details, hashes the password, creates the DB record, and returns a JWT auth token.

### Endpoint

```http
POST /captain/register
```

**URL**: `http://localhost:3000/captain/register`

### Headers

```http
Content-Type: application/json
```

### Request Body

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

### Validation Rules

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `fullname` | object/string | Yes | Cannot be empty |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Minimum 6 characters long |
| `vehicleColor` | string | Yes | Cannot be empty |
| `vehiclePlateNumber` | string | Yes | Cannot be empty |
| `vehicleCapacity` | integer | Yes | Minimum capacity of 1 |
| `vehicleType` | string | Yes | Must be one of `['car', 'bike', 'auto', 'van']` |

### Responses

* **`201 Created`**:
```json
{
  "message": "Captain registered successfully",
  "token": "<jwt-token>"
}
```

* **`400 Bad Request`** (Validation Error):
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

* **`400 Bad Request`** (Email Duplicate):
```json
{
  "message": "Captain with this email already exists"
}
```

---

## 2. Login Captain

Authenticates a captain using email and password, returning a JWT token and setting a `token` cookie.

### Endpoint

```http
POST /captain/login
```

**URL**: `http://localhost:3000/captain/login`

### Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "captain@example.com",
  "password": "password123"
}
```

### Validation Rules

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `email` | string | Yes | Valid email address |
| `password` | string | Yes | Cannot be empty |

### Responses

* **`200 OK`**:
```json
{
  "token": "<jwt-token>",
  "captain": {
    "_id": "<captain-id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plateNumber": "NY-1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

* **`400 Bad Request`** (Invalid Credentials or Validation Failure):
```json
{
  "message": "Invalid email or password"
}
```

---

## 3. Get Captain Profile

Retrieves the currently authenticated captain's profile details. Requires a valid JWT token via cookie or Authorization header.

### Endpoint

```http
GET /captain/profile
```

**URL**: `http://localhost:3000/captain/profile`

### Headers

```http
Authorization: Bearer <jwt-token>
```
*(Or send `token` cookie)*

### Responses

* **`200 OK`**:
```json
{
  "captain": {
    "_id": "<captain-id>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plateNumber": "NY-1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

* **`401 Unauthorized`**:
```json
{
  "message": "Access Denied"
}
```

---

## 4. Logout Captain

Logs out the current captain, clears the `token` cookie, and adds the JWT token to the blacklist DB collection.

### Endpoint

```http
GET /captain/logout
```

**URL**: `http://localhost:3000/captain/logout`

### Headers

```http
Authorization: Bearer <jwt-token>
```
*(Or send `token` cookie)*

### Responses

* **`200 OK`**:
```json
{
  "message": "Captain logged out successfully"
}
```

* **`401 Unauthorized`**:
```json
{
  "message": "Access Denied"
}
```

---

## Technical File Reference

### 1. [`controllers/captain.controller.js`](file:///c:/Users/sonis/Desktop/UBER/Backend/controllers/captain.controller.js)
- **`registerCaptain`**: Validates request parameters, checks email duplication, hashes password with `bcrypt`, calls `captainService.registerCaptain`, generates JWT with `captain.generateAuthToken()`, and returns HTTP 201.
- **`loginCaptain`**: Validates body input, queries DB for captain with `+password`, verifies password using `captain.comparePassword()`, sets `token` HTTP cookie, and returns HTTP 200 with JWT and captain profile.
- **`getCaptainProfile`**: Returns `req.captain` attached by `authCaptain` middleware.
- **`logoutCaptain`**: Extracts token from cookie or `Authorization` header, saves token to `blacklistTokenModel`, clears cookie, and returns success message.

### 2. [`middlewares/auth.middleware.js`](file:///c:/Users/sonis/Desktop/UBER/Backend/middlewares/auth.middleware.js)
- **`authCaptain`**:
  1. Extracts token from `req.cookies.token` or `Authorization: Bearer <token>`.
  2. Verifies token is not blacklisted via `blacklistTokenModel.findOne({ token })`.
  3. Decodes token using `jwt.verify(token, process.env.JWT_SECRET)`.
  4. Finds captain by ID (`decoded._id`).
  5. Attaches `captain` document to `req.captain` and passes control to `next()`.

### 3. [`routes/captain.routes.js`](file:///c:/Users/sonis/Desktop/UBER/Backend/routes/captain.routes.js)
- Maps routes to controller methods:
  - `POST /register` -> `captainController.registerCaptain` (with input validators)
  - `POST /login` -> `captainController.loginCaptain` (with input validators)
  - `GET /profile` -> `authMiddleware.authCaptain`, `captainController.getCaptainProfile`
  - `GET /logout` -> `authMiddleware.authCaptain`, `captainController.logoutCaptain`

### 4. [`services/captain.service.js`](file:///c:/Users/sonis/Desktop/UBER/Backend/services/captain.service.js)
- **`registerCaptain(options)`**: Accepts destructured arguments (`firstname`, `lastname`, `email`, `password`, `vehicleColor`, `vehiclePlateNumber`, `vehicleCapacity`, `vehicleType`). Enforces mandatory parameters and calls `captainModel.create()`.

### 5. [`models/captain.model.js`](file:///c:/Users/sonis/Desktop/UBER/Backend/models/captain.model.js)
- **Mongoose Schema**: Stores `fullname`, `email`, `password` (`select: false`), `status`, `sockerId`, `vehicle`, and `location`.
- **Instance Methods**:
  - `generateAuthToken()`: Signs JWT valid for 24h with `{ _id: this._id }`.
  - `comparePassword(password)`: Compares plaintext input with hashed password.
- **Static Methods**:
  - `hashPassword(password)`: Hashes password using bcrypt with 10 salt rounds.


### 5. Application Entry: `app.js`
- Mounts Captain routes:
  ```js
  app.use('/captain', captainRoutes);
  ```

