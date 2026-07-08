# 🧪 ADMIN TESTING GUIDE

**Quick reference for testing admin functionality and verifying submission requirements.**

---

## 🚀 Quick Start

### 1. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 2. Access Swagger Documentation

Open in browser: `http://localhost:3000/api-docs`

- Interactive endpoint testing
- Full request/response schemas
- Authentication setup

### 3. Import Postman Collection

- File: `postman/FixItNow.postman_collection.json`
- Collections tab → Import → Select file
- Endpoints organized by module

---

## 🔐 Admin Login Flow

### Step 1: Login with Admin Credentials

**Method**: `POST /api/auth/login`

**Postman**:

1. Go to `Auth → Login`
2. Body already has admin@fixitnow.dev and Password@123
3. Click Send

**cURL**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fixitnow.dev",
    "password": "Password@123"
  }'
```

**Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "admin@fixitnow.dev",
      "name": "Admin",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Step 2: Copy Access Token

- Copy the `accessToken` from response
- In Postman: Pre-request Script → Set `bearer_token` variable
  - Or manually add to Authorization header

### Step 3: Use Token for Admin Endpoints

- All subsequent requests will use the token automatically
- Postman collection includes Bearer token in headers

---

## 📊 Test Admin Endpoints

### 1. Get All Users

**Endpoint**: `GET /api/admin/users`

**Parameters**:

```
?page=1&limit=10&search=admin&role=ADMIN&status=ACTIVE
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "...",
        "email": "admin@fixitnow.dev",
        "name": "Admin",
        "role": "ADMIN",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 2. Get All Bookings

**Endpoint**: `GET /api/admin/bookings`

**Parameters**:

```
?page=1&limit=10&status=COMPLETED
```

**Shows**: All bookings with customer, technician, and payment details

### 3. Manage Categories

**Endpoint**: `GET /api/admin/categories`

**CRUD Operations**:

- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `PATCH /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

### 4. Ban/Unban Users

**Ban User**:

```
PATCH /api/admin/users/:userId/ban
```

**Unban User**:

```
PATCH /api/admin/users/:userId/unban
```

---

## ✅ Verify All 6 Mandatory Requirements

### 1. API Documentation ✅

- [ ] Swagger accessible at `/api-docs` → `http://localhost:3000/api-docs`
- [ ] Postman collection imports successfully
- [ ] All endpoints visible in both

### 2. Consistent Error Responses ✅

Test by sending invalid data:

```bash
# Send invalid email
POST /api/auth/login
Body: { "email": "invalid", "password": "Password@123" }
```

Expected error response:

```json
{
  "success": false,
  "message": "Validation error",
  "errorDetails": {
    "email": ["Invalid email format"]
  }
}
```

Check: Error format is consistent `{ success: false, message, errorDetails }`

### 3. Commits ✅

Verify 20+ commits:

```bash
git log --oneline
```

Should see 20+ commits with clear messages

### 4. Input Validation ✅

Test in Postman:

- [ ] Send missing required fields → Get validation error
- [ ] Send invalid email → Get email validation error
- [ ] Send invalid rating (e.g., 10) → Get range validation error
- [ ] Send invalid role → Get enum validation error

### 5. Admin Credentials ✅

- [ ] Login with `admin@fixitnow.dev` / `Password@123` succeeds
- [ ] Receive valid JWT token
- [ ] Can access `/api/admin/*` endpoints
- [ ] Regular users get 403 Forbidden on admin endpoints

### 6. Payment Integration ✅

Test Stripe flow:

**Step 1: Create Booking**

```
POST /api/bookings
Body: {
  "serviceId": "...",
  "preferredDate": "2026-07-15"
}
```

**Step 2: Accept Booking (as Technician)**

```
PATCH /api/bookings/:bookingId/accept
```

**Step 3: Create Payment Intent**

```
POST /api/payments/create
Body: { "bookingId": "..." }
```

Response includes Stripe `clientSecret`

**Step 4: Confirm Payment**

```
POST /api/payments/confirm
Body: { "bookingId": "..." }
```

Expected: Booking status changes to PAID

---

## 🧪 Test Different User Roles

### Customer Account

Email: `customer1@fixitnow.dev`
Password: `Password@123`

**Can**:

- Create bookings
- Make payments
- Leave reviews
- View own bookings

**Cannot**:

- Accept bookings
- Access admin endpoints
- Create services (unless technician)

### Technician Account

Email: `technician1@fixitnow.dev`
Password: `Password@123`

**Can**:

- Create services
- Set availability
- Accept/decline bookings
- Start/complete bookings

**Cannot**:

- Create categories
- Ban users
- Access admin endpoints

### Admin Account

Email: `admin@fixitnow.dev`
Password: `Password@123`

**Can**:

- Access all admin endpoints
- Manage users (ban/unban)
- View all bookings
- Manage categories
- View payment data

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/admin/..."

**Cause**: Not authenticated or not admin
**Fix**:

1. Login with admin account
2. Copy token to Authorization header
3. Verify role is ADMIN

### Issue: "Invalid email format" error

**Cause**: Validation failed
**Fix**:

1. This is expected! Shows validation works ✅
2. Use valid email format

### Issue: "Booking not in ACCEPTED status"

**Cause**: Can't create payment for requested booking
**Fix**:

1. First, accept the booking as technician
2. Then create payment intent

### Issue: "Stripe error"

**Cause**: Missing STRIPE_SECRET_KEY in .env
**Fix**:

1. Add `STRIPE_SECRET_KEY=sk_test_...` to .env
2. Restart server

---

## 📋 Submission Checklist

Before submitting, verify:

- [ ] 20+ commits in git history
- [ ] Admin login works with provided credentials
- [ ] All endpoints accessible in Postman
- [ ] Swagger docs at /api-docs
- [ ] Error responses are consistent
- [ ] Payment intent flow works
- [ ] Input validation works (test invalid data)
- [ ] Role-based access works (test as different roles)
- [ ] Build succeeds: `npm run build`
- [ ] Server starts: `npm run dev`

---

## 📝 Submission Information

**Admin Credentials**:

```
Email:    admin@fixitnow.dev
Password: Password@123
```

**Documentation**:

- README.md - Complete setup guide
- SUBMISSION.md - Submission checklist
- VERIFICATION_REPORT.md - Verification details

**API Endpoints**:

- Swagger: http://localhost:3000/api-docs
- Postman: postman/FixItNow.postman_collection.json

**Git History**:

```bash
git log --oneline | head -20
```

---

## 🎬 Recording Demo Video

**Duration**: 3-5 minutes
**Tool**: Loom (recommended) or OBS + Google Drive

**What to Show**:

1. (30 sec) Project overview - explain the architecture
2. (1 min) Authentication flow - login as different roles
3. (1.5 min) Main features - Create booking, accept, pay, complete
4. (1 min) Admin features - Manage users, categories, view all bookings
5. (1 min) Error handling - Show validation errors working
6. (30 sec) One technical challenge you solved

**Script**:

```
"FixItNow is a home services marketplace backend. It has 3 roles: customers,
technicians, and admins. Let me show you the key features working..."

[Login as customer] → [Create booking] → [Login as tech] → [Accept booking]
→ [Process payment] → [Complete booking] → [Admin dashboard]
```

---

**This guide ensures all 6 mandatory requirements are testable and ready for grading.**
