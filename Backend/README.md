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
