# QuickCore v1

QuickCore v1 is a Node.js backend API for a commerce-style platform built with Express and Mongoose. It includes authentication, user management, catalog management, warehouse and inventory tracking, shopping carts, order processing, payment records, deliveries, and notifications.

## Overview

The project follows a layered backend architecture:

- Routes define HTTP endpoints
- Controllers handle request/response adaptation
- Services contain business logic
- Models define Mongoose schemas and data relationships
- Middlewares enforce authentication, authorization, validation, and error handling

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Joi
- JSON Web Tokens
- bcrypt
- cookie-parser
- validator
- dotenv

## Project Structure

```text
.
├── server.js
├── package.json
├── package-lock.json
├── .env
└── src
    ├── app.js
    ├── controllers
    │   ├── auth.controller.js
    │   ├── brand.controller.js
    │   ├── cart.controller.js
    │   ├── category.controller.js
    │   ├── delivery.controller.js
    │   ├── driver.controller.js
    │   ├── inventory.controller.js
    │   ├── notification.controller.js
    │   ├── payment.controller.js
    │   ├── product.controller.js
    │   └── warehouse.controller.js
    ├── db
    │   └── db.js
    ├── middlewares
    │   ├── authenticate.middleware.js
    │   ├── authorize.middleware.js
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    ├── models
    │   ├── address.model.js
    │   ├── brand.model.js
    │   ├── cart.model.js
    │   ├── category.model.js
    │   ├── coupon.model.js
    │   ├── delivery.model.js
    │   ├── driver.model.js
    │   ├── inventory.model.js
    │   ├── notification.model.js
    │   ├── order.model.js
    │   ├── orderItem.model.js
    │   ├── payment.model.js
    │   ├── product.model.js
    │   ├── refreshToken.model.js
    │   ├── review.model.js
    │   ├── user.model.js
    │   └── warehouse.model.js
    ├── routes
    │   ├── auth.routes.js
    │   ├── brand.routes.js
    │   ├── cart.routes.js
    │   ├── category.routes.js
    │   ├── delivery.routes.js
    │   ├── driver.routes.js
    │   ├── inventory.routes.js
    │   ├── notification.routes.js
    │   ├── order.routes.js
    │   ├── payment.routes.js
    │   ├── product.routes.js
    │   └── warehouse.routes.js
    ├── services
    │   ├── auth.service.js
    │   ├── brand.service.js
    │   ├── cart.service.js
    │   ├── category.service.js
    │   ├── delivery.service.js
    │   ├── driver.service.js
    │   ├── inventory.service.js
    │   ├── notification.service.js
    │   ├── order.service.js
    │   ├── order.controller.js
    │   ├── payment.service.js
    │   ├── product.service.js
    │   └── warehouse.service.js
    ├── utils
    │   ├── ApiError.js
    │   ├── ApiResponse.js
    │   ├── asyncHandler.js
    │   ├── comparePassword.js
    │   ├── generateAccessToken.js
    │   ├── generateRefreshToken.js
    │   └── hashPassword.js
    └── validations
        ├── auth.validation.js
        ├── brand.validation.js
        ├── cart.validation.js
        ├── category.validation.js
        ├── delivery.validation.js
        ├── driver.validation.js
        ├── inventory.validation.js
        ├── order.validation.js
        ├── payment.validation.js
        ├── product.validation.js
        └── warehouse.validation.js
```

## Prerequisites

- Node.js 18+ recommended
- MongoDB instance
- A valid `.env` file

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRY=30d
NODE_ENV=development
```

## Running the Server

Start the development server:

```bash
npm run dev
```

Or run it directly:

```bash
npm start
```

The server listens on:

```text
http://localhost:3000
```

## API Overview

### Authentication

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Catalog

- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id`

- `GET /api/v1/brands`
- `GET /api/v1/brands/:id`
- `POST /api/v1/brands`
- `PATCH /api/v1/brands/:id`
- `DELETE /api/v1/brands/:id`

- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `POST /api/v1/products`
- `PATCH /api/v1/products/:id`
- `DELETE /api/v1/products/:id`

### Inventory and Warehouses

- `GET /api/v1/warehouses`
- `GET /api/v1/warehouses/:id`
- `POST /api/v1/warehouses`
- `PATCH /api/v1/warehouses/:id`
- `DELETE /api/v1/warehouses/:id`

- `GET /api/v1/inventories`
- `GET /api/v1/inventories/:id`
- `POST /api/v1/inventories`
- `PATCH /api/v1/inventories/:id`
- `DELETE /api/v1/inventories/:id`

### Cart and Orders

- `GET /api/v1/cart`
- `POST /api/v1/cart/add-item`
- `PATCH /api/v1/cart/update-item/:productId`
- `DELETE /api/v1/cart/remove-item/:productId`
- `DELETE /api/v1/cart/clear`

- `POST /api/v1/orders`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/cancel`
- `PATCH /api/v1/orders/:id/status`

### Payments, Drivers, Deliveries, Notifications

- `POST /api/v1/payments`
- `GET /api/v1/payments`
- `GET /api/v1/payments/:id`
- `PATCH /api/v1/payments/:id/status`

- `GET /api/v1/drivers`
- `GET /api/v1/drivers/:id`
- `POST /api/v1/drivers`
- `PATCH /api/v1/drivers/:id`
- `DELETE /api/v1/drivers/:id`

- `GET /api/v1/deliveries`
- `GET /api/v1/deliveries/:id`
- `POST /api/v1/deliveries`
- `PATCH /api/v1/deliveries/:id`
- `DELETE /api/v1/deliveries/:id`

- `GET /api/v1/notifications`
- `GET /api/v1/notifications/:id`
- `PATCH /api/v1/notifications/:id/read`
- `DELETE /api/v1/notifications/:id`
- `POST /api/v1/notifications`

## Notes for Developers

- The backend is organized into routes, controllers, services, models, middlewares, validations, and utils.
- Authentication is based on JWTs stored in cookies.
- Most write operations are protected by authentication and role-based authorization.
- The current codebase is an early-stage backend and still needs hardening for production features such as transactions, inventory reservation, refresh-token rotation, logging, and observability.

## Scripts

- `npm run dev` - start the server with nodemon
- `npm start` - start the server with Node.js
- `npm test` - placeholder test command

## Security and Operational Notes

- Keep `.env` private and do not commit secrets.
- Ensure MongoDB credentials and JWT secrets are set before running the app.
- Review the auth and checkout flows before deploying to production.
