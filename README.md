# 🚀 QuickCore v1

> **An AI-Native Quick Commerce Operations Platform** inspired by modern commerce systems like Blinkit, Zepto, Instamart, and Amazon Fresh.

QuickCore is a production-oriented backend that simulates how large-scale quick commerce platforms manage authentication, products, inventory, warehouses, carts, orders, payments, deliveries, and notifications.

Unlike a traditional CRUD application, QuickCore is designed as a scalable backend foundation that will evolve into an AI-driven operations platform powered by microservices, intelligent automation, and machine learning.

---

# 📌 Project Status

**Current Version**

> ✅ **v1.0 (MVP)**

Current focus:

- Production Backend
- Dockerized Infrastructure
- Redis Caching
- API Documentation
- Integration Testing

Upcoming versions will introduce:

- AI Microservices
- Event-Driven Architecture
- Real-Time Tracking
- ML-powered Decision Systems
- Customer & Admin Frontend

---

# 🌐 Live Demo

## API

```
Coming Soon
```

## Swagger Documentation

```
Coming Soon
```

## Health Check

```
Coming Soon
```

---

# ✨ Key Features

## 🔐 Authentication & Security

- JWT Authentication
- Refresh Token Authentication
- Secure HttpOnly Cookies
- Role-Based Access Control (RBAC)
- Joi Request Validation

---

## 🛒 Commerce Operations

- Product Management
- Category Management
- Brand Management
- Shopping Cart
- Order Processing
- Payment Management

---

## 🏬 Warehouse Operations

- Warehouse Management
- Inventory Tracking
- Driver Management
- Delivery Management
- Notification System

---

## ⚡ Performance

- Redis Integration
- Redis Response Caching
- Cache Invalidation Strategy
- Optimized Database Queries

---

## 📦 Infrastructure

- Docker
- Docker Compose
- MongoDB
- Redis
- Swagger / OpenAPI
- Health Check Endpoint

---

## 🧪 Testing

Production-grade Integration Tests

✔ Authentication

✔ Categories

✔ Brands

✔ Products

✔ Warehouses

✔ Inventory

✔ Cart

✔ Orders

✔ Payments

✔ Drivers

✔ Deliveries

✔ Notifications

**292+ Passing Integration Tests**

---

# 🏗 Architecture

```
                Client
                   │
                   ▼
             Express REST API
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
 Authentication           Middlewares
      │
      ▼
 Controllers
      │
      ▼
 Services
      │
 ┌────┴─────────┐
 ▼              ▼
Redis Cache   MongoDB
```

Future Architecture

```
                React Frontend
                       │
                       ▼
                 Express Backend
                       │
                Redis Cache Layer
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
 MongoDB                    FastAPI AI Services
                                      │
                                      ▼
                          ML Models & AI Agents
```

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Cache

- Redis

### Authentication

- JWT
- Refresh Tokens
- HttpOnly Cookies

### Validation

- Joi

### Documentation

- Swagger (OpenAPI 3)

### Testing

- Jest
- Supertest
- MongoDB Memory Server

### DevOps

- Docker
- Docker Compose

---

# 📂 Project Structure

```
src
├── config
├── controllers
├── db
├── docs
├── middlewares
├── models
├── routes
├── services
├── utils
└── validations
```

The project follows a layered architecture:

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Database / Cache
```

This separation keeps business logic independent from HTTP request handling.

---

# 📚 API Documentation

Once the application is running, interactive API documentation is available at:

```
/api-docs
```

The documentation includes:

- Request Examples
- Response Examples
- Authentication
- Validation Rules
- Error Responses
- Interactive API Testing

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/your-username/QuickCore.git

cd QuickCore
```

Install dependencies

```bash
npm install
```

---

# 🔧 Environment Variables

Create a `.env` file.

```env
PORT=3000

NODE_ENV=development

MONGO_URI=your_mongodb_uri

REDIS_URL=your_redis_url

JWT_ACCESS_SECRET=your_secret

JWT_REFRESH_SECRET=your_secret

JWT_ACCESS_EXPIRY=15m

JWT_REFRESH_EXPIRY=30d
```

---

# ▶ Running the Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

Docker

```bash
docker compose up --build
```

---

# 🧪 Running Tests

Run all integration tests

```bash
npm test
```

Current Status

```
292+ Tests Passing
```

---

# 🚀 Roadmap

## ✅ Version 1 (Current)

- Express Backend
- JWT Authentication
- RBAC
- CRUD APIs
- MongoDB
- Redis
- Docker
- Swagger
- Integration Testing

---

## 🚧 Version 1.1

- Helmet
- Rate Limiting
- Pino Logging
- Compression
- Environment Validation
- Production Hardening

---

## 🤖 Version 2

AI Microservices

- Demand Forecasting
- ETA Prediction
- Route Optimization
- Recommendation Engine
- AI Inventory Assistant
- AI Operations Dashboard

Powered by:

- FastAPI
- PyTorch
- Redis Queues

---

## ⚙ Version 3

Real-Time Commerce Platform

- BullMQ Workers
- Event-Driven Architecture
- WebSockets
- Live Driver Tracking
- Real-Time Inventory Updates
- Real-Time Admin Dashboard

---

# 💡 Why This Project?

Most backend portfolio projects stop at CRUD APIs.

QuickCore focuses on building the engineering foundation behind a production-scale commerce platform by combining scalable backend architecture, caching, testing, containerization, documentation, and a roadmap toward AI-powered operational intelligence.

The long-term vision is to transform QuickCore into an AI-native operations platform where backend services execute business logic while machine learning models and intelligent agents assist with forecasting, optimization, and decision-making.

---

# 📄 License

This project is released under the MIT License.

---

## 👨‍💻 Author

**Devansh Mishra**

If you found this project interesting, feel free to ⭐ the repository and connect with me on LinkedIn.