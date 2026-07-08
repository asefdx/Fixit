# FixItNow - Home Services Marketplace Backend API

A production-ready Node.js + Express backend API for a home services booking platform with integrated Stripe payment processing.

## 📋 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Payment**: Stripe
- **API Documentation**: Swagger/OpenAPI + Postman
- **Deployment**: Render

## 🚀 Key Features

### Authentication & Authorization
- Role-based access control (Customer, Technician, Admin)
- JWT-based authentication
- Secure password hashing with bcryptjs
- User registration with role selection

### Core Modules
- **Authentication**: Register, login, JWT token validation
- **User Management**: Profile updates, password changes, user listing (admin)
- **Technician Management**: Profile management, availability scheduling, service offerings, enhanced listing with filters
- **Service Management**: CRUD operations, search, filtering by category/location/price, pagination, sorting
- **Category Management**: Service categorization with admin controls
- **Booking System**: Complete lifecycle (REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED)
- **Payment Processing**: Stripe integration with payment intents, confirmations, and status tracking
- **Review System**: Post-completion reviews with ratings
- **Admin Panel**: User management, booking oversight, category administration

### Validation & Error Handling
- Server-side validation using Zod on all endpoints
- Structured error responses with `{ success, message, errorDetails }`
- Global error handling middleware
- Consistent HTTP status codes

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe API Key (https://stripe.com)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd fixit

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL
# - JWT_SECRET
# - STRIPE_SECRET_KEY
# - PORT (default: 3000)

# Setup database
npx prisma migrate dev

# Seed database with test data
npm run seed

# Build TypeScript
npm run build

# Start server
npm start
```

### Development

```bash
npm run dev
```

## 📚 API Documentation

### Access Points
- **Swagger/OpenAPI**: `/api-docs` (interactive UI)
- **Postman Collection**: `postman/FixItNow.postman_collection.json`

### Core Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

#### Users
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile
- `PATCH /api/users/password` - Change password

#### Technicians
- `GET /api/technician` - List technicians with filters
- `GET /api/technician/:id` - Get technician profile with reviews
- `PATCH /api/technician/profile` - Update technician profile
- `POST /api/technician/availability` - Add availability
- `PATCH /api/technician/availability/:id` - Update availability
- `DELETE /api/technician/availability/:id` - Delete availability

#### Services
- `GET /api/services` - List services with search/filter
- `POST /api/services` - Create service (technician only)
- `GET /api/services/:id` - Get service details
- `PATCH /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings (role-based)
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/accept` - Accept booking (technician)
- `PATCH /api/bookings/:id/decline` - Decline booking (technician)
- `PATCH /api/bookings/:id/start` - Start service (technician)
- `PATCH /api/bookings/:id/complete` - Complete booking (technician)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (customer)

#### Payments
- `POST /api/payments/create` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - List payment history
- `GET /api/payments/:id` - Get payment details

#### Reviews
- `POST /api/reviews` - Create review (customer, post-completion)
- `GET /api/reviews/service/:serviceId` - List service reviews
- `GET /api/reviews/technician/:technicianId` - List technician reviews

#### Admin
- `GET /api/admin/users` - List all users (with filters)
- `PATCH /api/admin/users/:id` - Update user
- `PATCH /api/admin/users/:id/ban` - Ban user
- `PATCH /api/admin/users/:id/unban` - Unban user
- `GET /api/admin/bookings` - List all bookings
- `GET /api/admin/categories` - Manage categories

## 🧪 Testing

### Using Postman
1. Import `postman/FixItNow.postman_collection.json`
2. Set Bearer token in authorization
3. Test endpoints in organized folder structure

### Sample Credentials

**Admin Account**
- Email: `admin@fixitnow.dev`
- Password: `Password@123`

**Test Customer**
- Email: `customer1@fixitnow.dev`
- Password: `Password@123`

**Test Technician**
- Email: `technician1@fixitnow.dev`
- Password: `Password@123`

## 📦 Project Structure

```
src/
├── app.ts                 # Express application setup
├── server.ts              # Server entry point
├── config/                # Configuration files
│   ├── env.ts            # Environment variables
│   ├── prisma.ts         # Prisma client
│   ├── stripe.ts         # Stripe initialization
│   └── swagger.ts        # Swagger documentation
├── middleware/            # Express middleware
│   ├── auth.ts           # JWT authentication
│   ├── errorHandler.ts   # Error handling
│   ├── validateRequest.ts # Request validation
│   └── notFound.ts       # 404 handler
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   ├── technician/       # Technician profiles
│   ├── category/         # Service categories
│   ├── service/          # Service listings
│   ├── booking/          # Booking management
│   ├── payment/          # Payment processing
│   ├── review/           # Reviews and ratings
│   └── admin/            # Admin controls
├── errors/                # Error classes
├── interfaces/            # TypeScript interfaces
├── utils/                 # Utility functions
└── routes/                # Route aggregation

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding script
```

## 🔒 Security Features

- JWT-based authentication with expiration
- Role-based access control (RBAC)
- Password hashing using bcryptjs
- Input validation with Zod
- CORS protection
- Error details hidden from client in production
- Secure Stripe payment processing

## 📝 Commit History

This project includes 20 meaningful commits covering:
1. Project initialization and setup
2. Database schema and Prisma ORM
3. Configuration management
4. Core middleware and error handling
5. Authentication module
6. User management module
7. Technician management module
8. Category management
9. Service management with advanced filtering
10. Booking lifecycle with state machine
11. Stripe payment integration
12. Review system
13. Admin module for platform oversight
14. Express application setup
15. Server entry point
16. Deployment configuration
17. Postman collection documentation
18. Environment variables template

Each commit represents a logical feature or architectural layer, making the project history clear and maintainable.

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Render will automatically build and deploy using `render.yaml`

### Required Environment Variables

```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=sk_live_or_sk_test_key
PORT=3000
NODE_ENV=production
```

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errorDetails": {}
}
```

## 🔄 Booking State Machine

```
REQUESTED
    ↓
ACCEPTED (by technician)
    ↓
PAID (after Stripe payment)
    ↓
IN_PROGRESS (technician starts work)
    ↓
COMPLETED (technician marks complete)
    
Alternative:
REQUESTED → DECLINED (by technician)
REQUESTED/ACCEPTED → CANCELLED (by customer)
```

## 📄 License

MIT

## 👤 Author

FixItNow Development Team

---

**For questions or issues, please refer to the API documentation or contact the development team.**
