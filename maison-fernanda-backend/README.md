# Maison Fernanda - Backend API

Express.js REST API for the Maison Fernanda luxury fashion ecommerce platform.

## Features

- **Authentication**: JWT-based user authentication (signup/login)
- **Product Management**: Full CRUD operations with search, filtering, and autocomplete
- **Order Management**: Order creation, tracking, and status updates
- **Payment Processing**: Stripe integration with secure checkout sessions
- **Admin Panel**: Protected endpoints for product and order management
- **Search**: MongoDB text indexing with fast autocomplete suggestions

## Tech Stack

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing
- **Jest** & **Supertest** - Testing

## Getting Started

### Prerequisites

- Node.js v16+
- MongoDB (local or Atlas)
- Stripe account for payment processing

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maison-fernanda
JWT_SECRET=your_jwt_secret_key_here_change_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Database Setup

Seed the database with sample products and users:
```bash
npm run seed
```

This creates:
- 10 sample luxury fashion products
- Admin user: `admin@maisonfernanda.com` / `admin123`
- Customer user: `customer@example.com` / `customer123`

### Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Testing

Run tests:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with filters, sorting, pagination)
- `GET /api/products/autocomplete?q=query` - Autocomplete search
- `GET /api/products/:id` - Get single product by ID or slug
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `POST /api/cart/sync` - Sync cart from client (protected)
- `GET /api/cart` - Get user's cart (protected)

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session (protected)
- `POST /api/checkout/webhook` - Handle Stripe webhooks

### Orders
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Deployment

### MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist connection IP (0.0.0.0/0 for all IPs)
4. Copy connection string to `MONGODB_URI` in your deployment environment

### Heroku Deployment

1. Create Heroku app:
```bash
heroku create maison-fernanda-api
```

2. Add MongoDB Atlas URI:
```bash
heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set STRIPE_SECRET_KEY="your-stripe-key"
```

3. Deploy:
```bash
git push heroku main
```

4. Seed database:
```bash
heroku run npm run seed
```

### Render Deployment

1. Connect GitHub repository
2. Create new Web Service
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in dashboard
5. Deploy

### Docker Deployment

Build image:
```bash
docker build -t maison-fernanda-backend .
```

Run container:
```bash
docker run -p 5000:5000 --env-file .env maison-fernanda-backend
```

## Stripe Webhook Setup

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:5000/api/checkout/webhook
```
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env`

For production, configure webhook in Stripe Dashboard:
- URL: `https://your-api.com/api/checkout/webhook`
- Events: `checkout.session.completed`

## Project Structure

```
maison-fernanda-backend/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   └── Order.js             # Order model
├── routes/
│   ├── auth.js              # Auth routes
│   ├── products.js          # Product routes
│   ├── cart.js              # Cart routes
│   ├── checkout.js          # Checkout & payment routes
│   └── orders.js            # Order routes
├── scripts/
│   └── seed.js              # Database seeding script
├── tests/
│   └── products.test.js     # Product API tests
├── .env.example             # Environment variables template
├── server.js                # Express server
├── package.json
├── Procfile                 # Heroku deployment
└── Dockerfile               # Docker containerization
```

## Security Considerations

- JWT tokens expire after 30 days
- Passwords hashed with bcrypt (10 salt rounds)
- Admin routes protected with role-based middleware
- CORS configured for frontend origin only
- Helmet.js for security headers
- Input validation with express-validator

## Support

For issues or questions, please contact the development team.

## License

MIT

