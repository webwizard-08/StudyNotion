# PROJECT REPORT — StudyNotion (EdTech Backend)

> **Project:** StudyNotion MERN EdTech Backend  
> **Type:** Backend-only (Node.js + Express + MongoDB)  
> **Status:** Partially built (entry point & routes missing)

---

# 1. Project Overview

## Purpose
StudyNotion is a backend for an online education platform where:
- **Students** can browse courses, enroll, and learn
- **Instructors** can create and manage courses
- **Admins** can oversee the platform

## Features (Planned / Partially Built)
| Feature | Status |
|---------|--------|
| User Signup with OTP | ✅ Built |
| Login with JWT | ✅ Built |
| Password Reset via Email | ✅ Built |
| Role-based Access (Student/Instructor/Admin) | ✅ Middleware built |
| Course Management | ❌ No controllers yet |
| Rating & Review | ❌ No controllers yet |
| Course Progress Tracking | ❌ No controllers yet |

## Target Users
- **Students** — want to learn from courses
- **Instructors** — want to create & sell courses
- **Admin** — manages users and content

---

# 2. Folder Structure

```
E:\Server
├── .env                        # Environment variables
├── .vscode/
│   └── settings.json           # VS Code settings
├── config/
│   └── database.js             # MongoDB connection logic
├── controllers/
│   ├── Auth.js                 # Signup, Login, SendOtp, ChangePassword
│   └── ResetPassward.js        # Reset password via email token
├── middlewares/
│   └── auth.js                 # JWT verification & role-checking
├── models/
│   ├── User.js                 # User schema
│   ├── OTP.js                  # OTP schema (with auto-email)
│   ├── Profile.js              # User profile details
│   ├── Course.js               # Course schema
│   ├── Section.js              # Course section schema
│   ├── SubSection.js           # Video/sub-topic within a section
│   ├── CourseProgress.js       # Tracks completed videos per course
│   ├── Tags.js                 # Category/tag for courses
│   └── RatingAndReview.js      # Student ratings & reviews
├── routes/                     # (EMPTY — no routes defined)
├── utils/
│   └── mailSender.js           # Nodemailer email sender
├── index.js                    # (EMPTY — entry point not written yet)
├── package.json
└── package-lock.json
```

## How Folders Communicate

```
index.js (entry point)
    ↓
routes/ (route definitions — NOT YET CREATED)
    ↓
middlewares/auth.js (runs before controller)
    ↓
controllers/Auth.js or controllers/ResetPassward.js
    ↓
models/ (Mongoose schemas)
    ↓
config/database.js (MongoDB connection)
    ↓
utils/mailSender.js (sends emails when needed)
```

**Real flow:** Browser → index.js → Routes → Middleware → Controller → Model → Database

---

# 3. File-by-File Explanation

---

## 3.1 `index.js` (Entry Point)

### Purpose
Should start the Express server, connect to the database, and mount all routes.

### Current State
**Empty (0 lines).** The project cannot run yet — this file needs to be written.

### What It Should Contain (based on convention)
```js
const express = require('express');
const app = express();
require('dotenv').config();
const database = require('./config/database');

database.connect();                     // Connect to MongoDB
app.use(express.json());                // Parse JSON bodies
app.use(require('cookie-parser')());    // Parse cookies

// Mount routes (not yet created)
// app.use('/api/v1/auth', authRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running');
});
```

### Dependencies
- `express` — web framework
- `dotenv` — load .env variables
- `cookie-parser` — parse cookies for JWT
- `./config/database` — MongoDB connection

---

## 3.2 `config/database.js`

### Purpose
Connects to MongoDB using Mongoose.

### Imports
```js
const mongoose = require('mongoose');
require('dotenv').config();
```

### Exports
```js
exports.connect = () => { ... }
```

### Execution Flow
1. Reads `MONGODB_URI` from `.env`
2. Calls `mongoose.connect()` with `useNewUrlParser: true` and `useUnifiedTopology: true`
3. Logs success or exits with error code 1

> ⚠️ **NOTE:** The `.env` file does **not** contain `MONGODB_URI` — only `MAIL_HOST`, `MAIL_PASS`, `MAIL_USER`, `JWT_SECRET`. This means the database connection will **fail** because `process.env.MONGODB_URI` will be `undefined`.

### Called By
- `index.js` (once written)

---

## 3.3 `controllers/Auth.js`

### Purpose
Handles authentication: Send OTP, Signup, Login, Change Password.

### Imports
```js
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const dotenv = require("dotenv");
```

### Exports
```js
exports.sendOtp
exports.signup
exports.login
exports.changePassword
```

---

### `sendOtp`

**Flow:**
1. Get `email` from `req.body`
2. Check if user already exists → if yes, return 401
3. Generate a 6-digit numeric OTP using `otp-generator`
4. Check if OTP is unique in DB (loop until unique — can cause infinite loop)
5. Save OTP to database with the email
6. Return OTP in response

**Called by:** POST route (not yet created)

---

### `signup`

**Flow:**
1. Get `firstName`, `lastName`, `email`, `password`, `otp`, `confirmPassword`, `accountType`, `contactNumber` from body
2. Validate all fields are present → if missing, return 403
3. Check password === confirmPassword → if no, return 403
4. Check if user already exists → if yes, return 401
5. Find the most recent OTP for this email from DB
6. Compare received OTP with DB OTP → if mismatch, return 401
7. Hash password with bcrypt (salt rounds = 10)
8. Create a Profile document (empty fields)
9. Create a User document with hashed password, linked to Profile
10. Return success with user data

**Called by:** POST route (not yet created)

---

### `login`

**Flow:**
1. Get `email`, `password` from body
2. Validate both present → if not, return 400
3. Find user by email, populate `additionalDetails` (Profile)
4. If user not found → return 404
5. Compare password using bcrypt → if wrong, return 401
6. Create JWT payload: `{ email, id, accountType }`
7. Sign JWT with `JWT_SECRET`, expires in `1h`
8. Remove password from user object, attach token
9. Set cookie named `"token"` that expires in 3 days, `httpOnly: true`
10. Return success with user and cookie

**Called by:** POST route (not yet created)

---

### `changePassword`

**Flow:**
- **NOT IMPLEMENTED** — only has try/catch skeleton with TODO comments

---

## 3.4 `controllers/ResetPassward.js`

### Purpose
Handles password reset via email link.

### Imports
```js
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
```

> ⚠️ **BUG:** `bcrypt` is used on line 85 but never imported.

### Exports
```js
exports.resetPasswordToken   // Step 1: Send reset link
exports.resetPassword        // Step 2: Actually reset password
```

---

### `resetPasswordToken`

**Flow:**
1. Get `email` from body
2. Find user by email → if not found, return 404
3. Generate a random UUID token using `crypto.randomUUID()`
4. Save token and `resetPasswordExpires` (now + 1 hour) to user document
5. Create reset URL: `http://localhost:3000/update-password/${token}`
6. Send email with the reset link using `mailSender`
7. Return success

---

### `resetPassword`

**Flow:**
1. Get `password`, `confirmPassword`, `token` from body
2. Validate password === confirmPassword → if no, return 400
3. Find user by token → if not found, return 400 ("Invalid token")
4. Check if token expired (`resetPasswordExpires < Date.now()`) → if expired, return 400
5. Hash password using bcrypt
6. Update user's password in DB
7. Return success

> ⚠️ **BUG:** bcrypt is not imported — this will crash at runtime.

---

## 3.5 `middlewares/auth.js`

### Purpose
Protects routes by verifying JWT and checking user roles.

### Imports
```js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
```

### Exports
```js
exports.auth         // Verify JWT token
exports.isStudent    // Check if user is Student
exports.isInstructor // Check if user is Instructor
exports.isAdmin      // Check if user is Admin
```

---

### `auth`

**Flow:**
1. Extract token from: `req.cookies.token` OR `req.body.token` OR `req.header("Authorization").replace("Bearer ", "")`
2. If no token → return 401
3. Verify token with `jwt.verify(token, JWT_SECRET)` → decode payload
4. Attach decoded payload to `req.user`
5. Call `next()` to proceed to controller

**Called by:** Routes that need authentication

---

### `isStudent`

**Flow:**
1. Check `req.user.accountType !== "Student"`
2. If not student → return 403
3. Call `next()`

### `isInstructor`

Same pattern — checks for `"Instructor"`

### `isAdmin`

Same pattern — checks for `"Admin"`

---

## 3.6 `utils/mailSender.js`

### Purpose
Sends emails using Nodemailer.

### Imports
```js
const nodemailer = require('nodemailer');
```

### Export
```js
module.exports = mailSender;
```

### Flow
1. Create transporter with `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`
2. Send mail with `from`, `to`, `subject`, `html`
3. Log success/error

### Called By
- `OTP.js` model (pre-save hook)
- `ResetPassward.js` controller

---

## 3.7 Models

### `models/User.js`

**Schema fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `firstName` | String | ✅ | trimmed |
| `lastName` | String | ✅ | trimmed |
| `email` | String | ✅ | unique, lowercase |
| `password` | String | ✅ | ⚠️ has `enum` + `required: true` twice (bug) |
| `additionalDetails` | ObjectId | ✅ | ref: `"profile"` |
| `courses` | [ObjectId] | ❌ | ref: `"Course"` |
| `image` | String | ✅ | default DiceBear avatar |
| `token` | String | ❌ | for password reset |
| `resetPasswordExpires` | Date | ❌ | for password reset |
| `courseProgress` | [ObjectId] | ❌ | ref: `"CourseProgress"` |

**Relationship:** Each User has one Profile (via `additionalDetails`), many Courses, many CourseProgress records.

---

### `models/OTP.js`

**Schema fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `email` | String | ✅ | |
| `otp` | String | ✅ | |
| `createdAt` | Date | ❌ | default: now, TTL: 5 min |

**Pre-save Hook:**
- Before saving, if `otp` is modified → calls `sendVerficationEmail()`
- Function tries to send email via `sendEmail()` — ⚠️ **BUG:** `sendEmail` is not defined (likely meant `mailSender`)

**TTL Index:** Documents auto-delete after 5 minutes via `expires: 5*60`

---

### `models/Profile.js`

**Schema fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `gender` | String | ❌ | |
| `dateOfBirth` | Date | ✅ | ⚠️ created with empty string — will fail validation |
| `about` | String | ✅ | trimmed — same issue |
| `contactNumber` | Number | ❌ | |

**Relationship:** Referenced by User via `additionalDetails`

---

### `models/Course.js`

**Schema fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `courseName` | String | ✅ | |
| `courseDescription` | String | ✅ | |
| `thumbnail` | String | ❌ | |
| `coursePrice` | Number | ❌ | |
| `courseInstructor` | String | ❌ | |
| `whatYouWillLearn` | String | ❌ | |
| `courseContent` | [ObjectId] | ❌ | ref: `"Section"` |
| `ratingAndReviews` | [ObjectId] | ❌ | ref: `"RatingAndReview"` |
| `tag` | ObjectId | ❌ | ref: `"Tag"` |
| `studentsEnrolled` | [ObjectId] | ✅ | ref: `"User"` |

**Relationships:** Course has many Sections, many RatingAndReviews, one Tag, many enrolled Users.

---

### `models/Section.js`

**Schema fields:**
| Field | Type | Required |
|-------|------|----------|
| `sectionName` | String | ✅ |
| `subSections` | [ObjectId] | ❌ (ref: `"SubSection"`) |

**Relationship:** Section has many SubSections.

---

### `models/SubSection.js`

**Schema fields:**
| Field | Type |
|-------|------|
| `title` | String |
| `timeDuration` | String |
| `description` | String |
| `videoUrl` | String |

**No required fields** — all optional. Represents a single video/lesson.

---

### `models/CourseProgress.js`

**Schema fields:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `courseId` | ObjectId | ✅ | ref: `"Course"` |
| `completedVideos` | [ObjectId] | ❌ | ⚠️ ref: `"SunSection"` (typo — should be `"SubSection"`) |

**Purpose:** Tracks which videos a student has completed in a course.

---

### `models/Tags.js`

**Schema fields:**
| Field | Type | Required |
|-------|------|----------|
| `tagName` | String | ✅ |
| `description` | String | ✅, trimmed |
| `course` | ObjectId | ✅ (ref: `"Course"`) |

**Purpose:** Categories/tags for organizing courses.

---

### `models/RatingAndReview.js`

**Schema fields:**
| Field | Type | Required |
|-------|------|----------|
| `user` | ObjectId | ✅ (ref: `"User"`) |
| `rating` | Number | ✅ |
| `review` | String | ✅ |

**Relationship:** Belongs to a User, embedded in Course via `ratingAndReviews` array.

---

### `package.json`

```json
{
  "name": "Server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcrypt": "^6.0.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.7.3",
    "nodemailer": "^9.0.1",
    "nodemon": "^3.1.14",
    "otp-generator": "^4.0.1"
  }
}
```

> ⚠️ Note: `"main": "server.js"` but actual entry is `index.js`. This mismatch is harmless but inconsistent.

---

## File Dependency Graph

```
config/database.js
    └── depends on: mongoose, dotenv

controllers/Auth.js
    └── depends on: models/User, models/OTP, models/Profile,
                    otp-generator, bcrypt, jsonwebtoken, dotenv

controllers/ResetPassward.js
    └── depends on: models/User, utils/mailSender, crypto

middlewares/auth.js
    └── depends on: jsonwebtoken, dotenv

utils/mailSender.js
    └── depends on: nodemailer

models/*.js
    └── depends on: mongoose
```

---

# 4. Backend Flow

```
Browser / Frontend
    │
    ▼
  HTTP Request (JSON + optional Cookie/Bearer Token)
    │
    ▼
  index.js (Express App)
    │  ├── express.json() — parses JSON body
    │  ├── cookie-parser — parses cookies
    │  └── CORS (not yet added)
    │
    ▼
  Routes (NOT YET CREATED)
    │  Example: app.use("/api/v1/auth", authRoutes)
    │
    ▼
  Middleware (auth.js)
    │  ├── auth        → verifies JWT, attaches user to req
    │  ├── isStudent   → checks role === "Student"
    │  ├── isInstructor → checks role === "Instructor"
    │  └── isAdmin      → checks role === "Admin"
    │
    ▼
  Controller (Auth.js / ResetPassward.js)
    │  ├── Reads req.body, req.user, req.cookies
    │  ├── Calls model functions (find, create, update)
    │  ├── Hashes passwords (bcrypt)
    │  ├── Signs JWT tokens
    │  └── Returns res.status().json({ success, message, data })
    │
    ▼
  Model (Mongoose Schema)
    │  ├── Defines structure & validation
    │  ├── Methods: find, findOne, create, findOneAndUpdate
    │  └── OTP model has pre-save hook to send email
    │
    ▼
  MongoDB (Database)
    │
    ▼
  Response sent back to Browser as JSON
```

### Request Example (Signup)
```js
// POST /api/v1/auth/signup
// Body:
{
  "firstName": "Adarsh",
  "lastName": "Yadav",
  "email": "adarsh@test.com",
  "password": "Secret@123",
  "confirmPassword": "Secret@123",
  "otp": "482917",
  "accountType": "Student",
  "contactNumber": "9999999999"
}

// Response:
{
  "success": true,
  "message": "User created successfully",
  "user": { ... }
}
```

---

# 5. Frontend Flow

> **Note:** No frontend exists in this project. This is a backend-only repository. The frontend would be a separate React app.

## How Frontend Would Connect (Conceptual)

```
React App (port 3000)
    │
    ├── Pages: LoginPage, SignupPage, Dashboard, Courses, etc.
    ├── Components: Navbar, CourseCard, etc.
    ├── State: React Context or Redux (user, auth status)
    │
    ├── API Calls using axios/fetch:
    │   POST /api/v1/auth/sendOtp       → { email }
    │   POST /api/v1/auth/signup         → { firstName, lastName, email, ... }
    │   POST /api/v1/auth/login          → { email, password }
    │   POST /api/v1/auth/reset-password-token → { email }
    │   POST /api/v1/auth/reset-password → { password, confirmPassword, token }
    │
    └── JWT stored in: httpOnly cookie (set by server on login)
                        OR localStorage (not recommended)
```

---

# 6. Authentication

## Complete Auth Flow

### 6.1 Signup Flow

```
User fills form
    ↓
Frontend sends POST with email
    ↓
sendOtp controller:
    1. Check email not already registered
    2. Generate 6-digit OTP
    3. Save OTP to DB (auto-deletes in 5 min)
    4. OTP pre-save hook sends email with OTP
    5. Return success
    ↓
User checks email for OTP
    ↓
Frontend sends POST with all details + OTP
    ↓
signup controller:
    1. Validate all fields present
    2. Check password === confirmPassword
    3. Check user doesn't already exist
    4. Find most recent OTP for this email
    5. Compare OTPs → must match
    6. Hash password with bcrypt (10 rounds)
    7. Create empty Profile document
    8. Create User with hashed password + Profile reference
    9. Return success
```

### 6.2 OTP System

- Generated using `otp-generator` (6 digits, no letters, no special chars)
- Stored in MongoDB with TTL index (`expires: 5*60` = 5 minutes)
- Pre-save hook attempts to email the OTP
- On signup, the **most recent** OTP for that email is fetched (sorted by `createdAt` desc)

### 6.3 Login Flow

```
User enters email + password
    ↓
login controller:
    1. Find user by email
    2. Compare password using bcrypt.compare()
    3. If match → create JWT payload { email, id, accountType }
    4. Sign JWT with JWT_SECRET, expires in 1 hour
    5. Set httpOnly cookie "token" (expires in 3 days)
    6. Return user data + cookie
```

### 6.4 JWT (JSON Web Token)

- **Library:** `jsonwebtoken` (v9)
- **Payload structure:**
  ```js
  { email: "user@test.com", id: "abc123", accountType: "Student" }
  ```
- **Secret:** `process.env.JWT_SECRET`
- **Expiry:** 1 hour
- **Storage:** httpOnly cookie (prevents XSS attacks)

### 6.5 Password Hashing

- **Library:** `bcrypt` (v6)
- **Salt rounds:** 10
- **Process:** `bcrypt.hash(password, 10)` on signup, `bcrypt.compare(password, hash)` on login
- Passwords are **never** stored as plain text — only the hash is saved

### 6.6 Protected Routes

Protected by `middlewares/auth.js`:

```js
// Example usage (conceptual):
router.post("/create-course", auth, isInstructor, createCourse);
router.get("/my-courses", auth, isStudent, getEnrolledCourses);
router.delete("/user/:id", auth, isAdmin, deleteUser);
```

**Three middleware layers:**
1. `auth` — verifies JWT exists and is valid, attaches user to `req.user`
2. `isStudent` / `isInstructor` / `isAdmin` — checks `accountType` field

### 6.7 Logout

- No logout controller exists yet
- **Strategy:** Clear the httpOnly cookie by setting it with `maxAge: 0` or `expires: new Date(0)`

### 6.8 Password Reset Flow

```
Step 1: User clicks "Forgot Password"
    ↓
Frontend sends { email } to /reset-password-token
    ↓
resetPasswordToken controller:
    1. Find user by email
    2. Generate crypto.randomUUID() as token
    3. Save token + expiry (1 hour) to user document
    4. Email reset link: http://localhost:3000/update-password/${token}
    ↓
Step 2: User clicks link, enters new password
    ↓
Frontend sends { password, confirmPassword, token } to /reset-password
    ↓
resetPassword controller:
    1. Validate passwords match
    2. Find user by token
    3. Check token not expired
    4. Hash new password
    5. Update in DB
```

---

# 7. Database (MongoDB)

## Schema Relationships Diagram

```
User ──┬── additionalDetails ──→ Profile (1:1)
       ├── courses[] ────→ Course (M:N)
       ├── courseProgress[] ──→ CourseProgress (1:M)
       └── (referenced by) RatingAndReview.user

Course ─┬── courseContent[] ──→ Section (1:M)
        ├── ratingAndReviews[] ──→ RatingAndReview (1:M)
        ├── tag ──→ Tag (M:1)
        └── studentsEnrolled[] ──→ User (M:N)

Section ── subSections[] ──→ SubSection (1:M)

CourseProgress ─┬── courseId ──→ Course (1:1)
                └── completedVideos[] ──→ SubSection (M:M)
```

## Collections Overview

| Collection | Documents | Purpose |
|-----------|-----------|---------|
| `users` | User docs | Stores all users (Students, Instructors, Admins) |
| `profiles` | Profile docs | Extended user info (gender, DOB, bio) |
| `otps` | OTP docs | Temporary OTP storage (auto-deletes after 5 min) |
| `courses` | Course docs | Course details, content structure |
| `sections` | Section docs | Chapters/modules within a course |
| `subsections` | SubSection docs | Individual videos/lessons |
| `courseprogresses` | CourseProgress docs | Per-student progress per course |
| `tags` | Tag docs | Categories/course tags |
| `ratingandreviews` | RatingAndReview docs | Student reviews and ratings |

## Key Schema Details

### User Schema Issues
1. **`password` field has `enum: ['Admin', 'Student', 'Instructor']`** — This is logically wrong. Enums should be on `accountType`, not password. The `accountType` field is missing from the schema despite being used in controllers.
2. **`required: true` is duplicated** on the password field.

### Profile Schema Issues
- `dateOfBirth` and `about` are marked `required: true`, but the Auth controller creates them with empty strings → validation will fail.

### OTP Schema Issues
- Pre-save hook calls `sendEmail()` but the function is named `sendVerficationEmail()` — runtime error.

### CourseProgress Schema Issues
- `completedVideos` references `"SunSection"` instead of `"SubSection"` — typo will cause population to fail.

---

# 8. APIs

> **Note:** Routes are not yet created. Below are the **planned/implied** APIs based on existing controllers.

## 8.1 Send OTP

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/sendOtp` |
| **Auth** | No |
| **Middleware** | None |

**Request Body:**
```json
{ "email": "user@example.com" }
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "482917"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Controller:** `sendOtp` in `controllers/Auth.js`

---

## 8.2 Signup

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/signup` |
| **Auth** | No |
| **Middleware** | None |

**Request Body:**
```json
{
  "firstName": "Adarsh",
  "lastName": "Yadav",
  "email": "adarsh@test.com",
  "password": "Secret@123",
  "confirmPassword": "Secret@123",
  "otp": "482917",
  "accountType": "Student",
  "contactNumber": "9999999999"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": { "...user data..." }
}
```

**Error Responses:**
- `403` — Missing fields / Password mismatch
- `401` — User already exists / Invalid OTP

**Controller:** `signup` in `controllers/Auth.js`

---

## 8.3 Login

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/login` |
| **Auth** | No |
| **Middleware** | None |

**Request Body:**
```json
{
  "email": "adarsh@test.com",
  "password": "Secret@123"
}
```

**Success Response (200)** — Sets httpOnly cookie + JSON:
```json
{
  "success": true,
  "message": "User logged in successfully",
  "user": { "...user data (password: undefined)..." }
}
```

**Error Responses:**
- `400` — Missing fields
- `404` — User not found
- `401` — Invalid credentials

**Controller:** `login` in `controllers/Auth.js`

**Cookie Details:**
- Name: `token`
- Value: JWT string
- httpOnly: true
- Expires: 3 days

---

## 8.4 Reset Password Token

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/reset-password-token` |
| **Auth** | No |
| **Middleware** | None |

**Request Body:**
```json
{ "email": "user@example.com" }
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Reset password link sent to your email"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found with this email"
}
```

**Controller:** `resetPasswordToken` in `controllers/ResetPassward.js`

---

## 8.5 Reset Password

| Property | Value |
|----------|-------|
| **Method** | `POST` |
| **Route** | `/api/v1/auth/reset-password` |
| **Auth** | No (uses token from email link) |
| **Middleware** | None |

**Request Body:**
```json
{
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123",
  "token": "uuid-from-email-link"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400` — Passwords don't match / Invalid token / Token expired

**Controller:** `resetPassword` in `controllers/ResetPassward.js`

---

# 9. Environment Variables

| Variable | Purpose | Example Value (Hidden) |
|----------|---------|----------------------|
| `MAIL_HOST` | SMTP server hostname for sending emails | `smtp.gmail.com` |
| `MAIL_PASS` | SMTP password / app password | `********` |
| `MAIL_USER` | SMTP email address (sender) | `noreply@study....` |
| `JWT_SECRET` | Secret key used to sign & verify JWT tokens | `********` |
| *(Missing)* `MONGODB_URI` | MongoDB connection string | Should be added |

---

# 10. Packages

| Package | Version | Why Used |
|---------|---------|----------|
| `express` | ^5.2.1 | Web framework for Node.js — handles routing, middleware, HTTP requests/responses |
| `mongoose` | ^9.7.3 | ODM (Object Data Modeling) for MongoDB — defines schemas, handles queries, validation |
| `bcrypt` | ^6.0.0 | Password hashing — `hash()` for signup, `compare()` for login |
| `jsonwebtoken` | ^9.0.3 | JWT creation & verification — `sign()` for login, `verify()` for auth middleware |
| `cookie-parser` | ^1.4.7 | Parses cookies from HTTP requests — used to read JWT from cookies |
| `dotenv` | ^17.4.2 | Loads `.env` file into `process.env` — keeps secrets out of code |
| `nodemailer` | ^9.0.1 | Sends emails — used for OTP verification and password reset links |
| `otp-generator` | ^4.0.1 | Generates random OTPs (configurable: length, digits, alphabets) |
| `nodemon` | ^3.1.14 | Dev tool — auto-restarts server on file changes (`npm run dev`) |
| `crypto` | (built-in) | Generates random UUIDs for password reset tokens — **no install needed** |

---

# 11. Architecture Diagrams

## 11.1 Overall Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│   Pages: Login | Signup | Dashboard | Courses | ResetPassword    │
│   State: Context API / Redux                                     │
│   HTTP: axios / fetch                                             │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP (JSON)
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js + Express)                   │
│                                                                   │
│   index.js  ───►  Routes  ───►  Middleware  ───►  Controllers    │
│                     (empty)        (auth.js)     (Auth.js,        │
│                                                   ResetPassward)  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
│   Collections: users, profiles, otps, courses, sections,         │
│                subsections, courseprogresses, tags,               │
│                ratingandreviews                                   │
└──────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                      EMAIL SERVICE (Nodemailer)                  │
│   Sends: OTP emails, Password reset links                        │
└──────────────────────────────────────────────────────────────────┘
```

## 11.2 Authentication Flow

```
                  ┌──────────┐
                  │  Browser │
                  └────┬─────┘
       ┌───────────────┼───────────────────┐
       │               │                   │
       ▼               ▼                   ▼
   [Signup]        [Login]            [Reset Password]
       │               │                   │
       │  POST         │  POST             │  POST
       │  /sendOtp     │  /login           │  /reset-password-token
       ▼               ▼                   ▼
   ┌────────┐    ┌──────────┐      ┌──────────────┐
   │Generate│    │Find User │      │Generate UUID │
   │  OTP   │    │  bcrypt  │      │  Save to DB  │
   │Save DB │    │ compare  │      │  Send Email  │
   │SendEmail│   │  JWT sign│      └──────┬───────┘
   └────────┘    │Set Cookie│             │
       │         └──────────┘             │
       │  POST             │              │
       │  /signup          │              │  POST
       │  (with OTP)       │              │  /reset-password
       ▼                  ▼              ▼
   ┌──────────┐    ┌──────────┐     ┌────────────┐
   │Validate  │    │Redirect  │     │Validate    │
   │  OTP     │    │Dashboard │     │  Token     │
   │Hash Pwd  │    │          │     │Hash Pwd    │
   │CreateUser│    │          │     │Update DB   │
   └──────────┘    └──────────┘     └────────────┘
```

## 11.3 Request Flow (Detailed)

```
CLIENT                              SERVER
  │                                   │
  │  POST /api/v1/auth/login          │
  │  { email, password }              │
  │──────────────────────────────────►│
  │                                   │
  │                              ┌────┴────┐
  │                              │ express │
  │                              │ .json() │ ← parses body
  │                              └─────────┘
  │                                   │
  │                              ┌────┴────┐
  │                              │ cookie  │
  │                              │ -parser │ ← parses cookies
  │                              └─────────┘
  │                                   │
  │                              ┌────┴────┐
  │                              │  Route  │
  │                              │  matches│
  │                              │ /login  │
  │                              └─────────┘
  │                                   │
  │                              ┌────┴────┐
  │                              │  auth   │ ← verifies JWT
  │                              │(optional│   (not for login)
  │                              │  here)  │
  │                              └─────────┘
  │                                   │
  │                              ┌────┴────┐
  │                              │  login  │
  │                              │controller│
  │                              │  1. Find │
  │                              │  user    │
  │                              │  2. bcrypt│
  │                              │  3. JWT  │
  │                              │  4. Cookie│
  │                              └─────────┘
  │                                   │
  │                              ┌────┴────┐
  │                              │Mongoose │
  │                              │ .findOne│ → MongoDB
  │                              └─────────┘
  │                                   │
  │  { success: true, user, token }   │
  │◄──────────────────────────────────│
  │  Set-Cookie: token=...            │
```

## 11.4 Component Flow (Frontend — Conceptual)

```
App
├── PublicRoutes
│   ├── LoginPage
│   │   └── LoginForm (email, password → POST /login)
│   ├── SignupPage
│   │   ├── EmailForm (email → POST /sendOtp)
│   │   └── SignupForm (details + OTP → POST /signup)
│   └── ResetPasswordPage
│       ├── EmailForm (email → POST /reset-password-token)
│       └── NewPasswordForm (pwd + token → POST /reset-password)
│
└── ProtectedRoutes (requires auth → redirect to login if no token)
    ├── Dashboard (Student/Instructor/Admin views)
    ├── CourseList
    ├── CourseDetail
    └── ProfilePage
```

---

# 12. Learning Notes

## Section 1: Project Overview

### What I Learned
- An EdTech backend needs three user roles: Student, Instructor, Admin
- The backend handles auth, course management, progress tracking, and reviews
- Even without a frontend, you can build and test the backend using tools like Postman

### Common Mistakes
- Building backend without defining all routes first
- Not deciding on user roles early in the project
- Mixing backend and frontend code in the same repo

### Interview Questions
- Q: What is an EdTech platform? What are the main features?

### Revision Notes
- EdTech = Education Technology
- Three main actors: Students (consume), Instructors (create), Admins (manage)

---

## Section 2: Folder Structure

### What I Learned
- Separation of concerns: config, controllers, middlewares, models, routes, utils
- Controllers handle business logic, models handle data structure
- Routes connect URLs to controllers
- Middleware runs between request and controller

### Common Mistakes
- Putting business logic in route files instead of controllers
- Creating too many folders too early
- Not following a consistent naming convention

### Interview Questions
- Q: Why separate controllers from routes?
- A: Separation of concerns — routes define URLs, controllers define logic

### Revision Notes
```
MVC Pattern: Model (database) → View (frontend) → Controller (logic)
                ↕
            Express follows modified MVC: Route → Middleware → Controller → Model
```

---

## Section 3: File-by-File

### What I Learned
- Each file has a single responsibility
- `index.js` is always the entry point
- Models define how data looks, controllers define what happens
- Middleware is reusable code that runs before controllers

### Common Mistakes
- Forgetting to export functions from modules
- Circular dependencies between files
- Not error-handling in async functions
- Writing too much code in a single file

### Interview Questions
- Q: What is the difference between `module.exports` and `exports`?
- A: `exports` is a reference to `module.exports`. If you reassign `exports`, it breaks the reference.

---

## Section 4: Backend Flow

### What I Learned
- Request flows in one direction: Client → Server → Route → Middleware → Controller → Model → DB
- Response flows back: DB → Model → Controller → Response → Client
- Each layer does one thing

### Common Mistakes
- Not sending appropriate HTTP status codes
- Forgetting `next()` in middleware
- Putting heavy logic in middleware instead of controllers

### Interview Questions
- Q: What is the request-response cycle?

### Revision Notes
```
HTTP Status Codes to Remember:
200 — OK / Success
400 — Bad Request (client error)
401 — Unauthorized (no token / invalid)
403 — Forbidden (wrong role)
404 — Not Found
500 — Internal Server Error
```

---

## Section 5: Frontend Flow

### What I Learned
- Backend APIs are consumed by frontend via HTTP requests
- JWT tokens are stored in httpOnly cookies for security
- Frontend manages its own state (user info, auth status)

### Common Mistakes
- Storing JWT in localStorage (vulnerable to XSS)
- Not handling token expiry on frontend
- Not showing loading states during API calls

### Interview Questions
- Q: Why use httpOnly cookies instead of localStorage for JWT?
- A: httpOnly cookies cannot be accessed by JavaScript, preventing XSS attacks

---

## Section 6: Authentication

### What I Learned
- **Hashing** is one-way (bcrypt). **Encryption** is two-way (JWT).
- OTP must be short-lived (5 minutes in this project)
- JWT payload should be minimal (never include password)
- Password reset tokens need expiry (1 hour in this project)

### Common Mistakes
- Storing plain text passwords (never do this!)
- Not validating OTP expiry
- Not checking if OTP was already used
- Sending password in response
- Using weak JWT secrets

### Interview Questions
- Q: What is bcrypt? Why use salt rounds?
- A: bcrypt is a password hashing algorithm. Salt rounds (10 here) add computational cost to prevent brute-force attacks.
- Q: What is JWT? What are its three parts?
- A: JSON Web Token. Three parts: Header (algorithm), Payload (data), Signature (verification).
- Q: What is the difference between session auth and JWT auth?
- A: Sessions are stored on server; JWT is stored on client. JWT is stateless.
- Q: How does OTP work? Why use TTL index?
- A: OTP is a one-time password sent to email. TTL auto-deletes expired OTPs for cleanup.

### Revision Notes
```
Signup:  Validate → Hash password → Create in DB
Login:   Find user → Compare password → Generate JWT → Set cookie
Protect: Extract token → Verify JWT → Check role → Allow/Deny
```

---

## Section 7: Database

### What I Learned
- MongoDB is NoSQL — uses documents instead of tables
- Mongoose provides schema validation and relationships (ObjectId refs)
- `ref` creates relationships between collections
- `.populate()` fetches referenced documents

### Common Mistakes
- Not adding `ref` in schema (population won't work)
- Wrong references (e.g., `"SunSection"` instead of `"SubSection"`)
- Not using `unique: true` on emails
- Mixing required/optional fields incorrectly

### Interview Questions
- Q: What is the difference between SQL and NoSQL?
- A: SQL uses tables/rows, fixed schema. NoSQL uses collections/documents, flexible schema.
- Q: What is MongoDB ObjectId?
- A: A 12-byte unique identifier, MongoDB's default primary key.
- Q: What is `.populate()` in Mongoose?
- A: Replaces ObjectId references with the actual document data.
- Q: What is a TTL index?
- A: An index that automatically deletes documents after a specified time.

---

## Section 8: APIs

### What I Learned
- REST APIs use HTTP methods (GET, POST, PUT, DELETE)
- Every API has: Method + Route + Request + Response + Controller
- Consistent JSON response format `{ success, message, data }` helps frontend

### Common Mistakes
- Not following RESTful naming conventions
- Inconsistent response formats
- Not handling edge cases (missing data, wrong types)
- Returning sensitive data (password, OTP) in response

### Interview Questions
- Q: What is REST API?
- A: Representational State Transfer — a standard for building web APIs using HTTP methods.

---

## Section 9: Environment Variables

### What I Learned
- `.env` file keeps secrets out of source code
- `dotenv` package loads vars into `process.env`
- Never commit `.env` to git (add to `.gitignore`)

### Common Mistakes
- Committing `.env` to version control
- Hardcoding secrets in code
- Not having a `.env.example` file for other developers

### Interview Questions
- Q: Why use environment variables?
- A: To keep configuration (especially secrets) separate from code. Different values for dev/staging/production.

---

## Section 10: Packages

### What I Learned
- Every npm package solves a specific problem
- `express` handles HTTP, `mongoose` handles DB, `bcrypt` handles passwords
- Don't install packages you don't need

### Common Mistakes
- Installing unnecessary packages (bloats node_modules)
- Not checking package versions for breaking changes
- Using outdated packages with security vulnerabilities

### Interview Questions
- Q: What is the difference between `dependencies` and `devDependencies`?
- A: `dependencies` are needed in production, `devDependencies` are for development only.

---

# 13. Final Summary (Interview Prep)

## What is StudyNotion?
StudyNotion is a **MERN stack EdTech backend** that provides APIs for user authentication (signup, login, OTP, password reset) and course management on an online learning platform.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend Framework | Express.js (v5) |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT + bcrypt + httpOnly cookies |
| Email | Nodemailer |
| Password Reset | crypto.randomUUID() |
| OTP | otp-generator |

## What's Built?
- ✅ Send OTP via email
- ✅ Signup with OTP verification
- ✅ Login with JWT + httpOnly cookie
- ✅ Password reset (token via email)
- ✅ Auth middleware (JWT verification)
- ✅ Role middleware (Student/Instructor/Admin)
- ✅ 9 Mongoose models with relationships

## What's Missing?
- ❌ `index.js` (entry point) — empty
- ❌ `routes/` — empty, no routes defined
- ❌ `changePassword` — skeleton only
- ❌ Course CRUD controllers
- ❌ Rating & Review controllers
- ❌ CORS configuration

## Known Bugs
1. **Missing `MONGODB_URI`** in `.env` — connection will fail
2. **`password` field has `enum`** in User schema — should be `accountType`
3. **`bcrypt` not imported** in `ResetPassward.js` — will crash on use
4. **`"SunSection"` typo** in CourseProgress model — should be `"SubSection"`
5. **`OTP.js` pre-save calls `sendEmail()`** but function is `sendVerficationEmail()`
6. **`Profile.js` has `required: true`** on fields created with empty strings
7. **Infinite loop possible** in `sendOtp` while checking OTP uniqueness
8. **OTP returned in response** — security concern

## How to Make It Production-Ready
1. Create `index.js` with Express setup, DB connection, route mounting
2. Create route files and wire them to controllers
3. Fix all bugs listed above
4. Add CORS for frontend access
5. Add `MONGODB_URI` to `.env`
6. Build the remaining controllers (course, rating, profile)
7. Add input validation (express-validator or Joi)
8. Add rate limiting to OTP endpoint
9. Add proper error handling middleware
10. Set up `.gitignore` with `node_modules/` and `.env`

## Key Interview Talking Points
- "I built a RESTful backend for an EdTech platform using Express.js and MongoDB"
- "JWT tokens stored in httpOnly cookies prevent XSS attacks"
- "bcrypt with 10 salt rounds provides strong password security"
- "OTP system with 5-minute TTL auto-cleanup using MongoDB's TTL index"
- "Role-based access control with reusable middleware"
- "Nodemailer sends transactional emails (OTP, password reset)"
- "Mongoose schemas define clear data relationships with ObjectId references"

---

*Report generated by analyzing the StudyNotion backend project at `E:\Server`*
