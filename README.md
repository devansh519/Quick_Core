# QuickCore v1

QuickCore v1 is a Node.js backend API built with Express and Mongoose. It provides a foundation for ecommerce and delivery workflows, including authentication, user management, products, orders, inventory, warehouses, and related services.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- JSON Web Tokens
- bcrypt
- cookie-parser
- validator

## Project Structure

```text
.
|-- server.js
|-- package.json
|-- package-lock.json
`-- src
    |-- app.js
    |-- db
    |   `-- db.js
    |-- controllers
    |   `-- auth.controller.js
    |-- middlewares
    |   |-- authenticate.middleware.js
    |   |-- authorize.middleware.js
    |   `-- validate.middleware.js
    |-- models
    |   |-- address.model.js
    |   |-- brand.model.js
    |   |-- cart.model.js
    |   |-- category.model.js
    |   |-- coupon.model.js
    |   |-- delivery.model.js
    |   |-- driver.model.js
    |   |-- inventory.model.js
    |   |-- notification.model.js
    |   |-- order.model.js
    |   |-- orderItem.model.js
    |   |-- payment.model.js
    |   |-- product.model.js
    |   |-- refreshToken.model.js
    |   |-- review.model.js
    |   |-- user.model.js
    |   `-- warehouse.model.js
    |-- routes
    |   `-- auth.routes.js
    |-- services
    |   `-- auth.service.js
    `-- utils
        |-- comparePassword.js
        |-- generateAccessToken.js
        |-- generateRefreshToken.js
        `-- hashPassword.js
```

## Getting Started

### Prerequisites

- Node.js (recommended latest LTS)
- MongoDB connection string

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root with:

```env
MONGO_URI=your_mongodb_connection_string
```

### Run the Project

Start the development server:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

The server listens on:

```text
http://localhost:3000
```

## API Routes

- `POST /api/v1/auth/register` - register a new user
- `POST /api/v1/auth/login` - login and receive access/refresh tokens
- `POST /api/v1/auth/refresh-token` - refresh access token
- `POST /api/v1/auth/logout` - logout and invalidate refresh token

## Scripts

- `npm run dev` - start the server with nodemon
- `npm start` - start the server with Node.js
- `npm test` - placeholder test command

## Notes

- Keep `.env` private and do not commit it.
- Commit `package-lock.json` to ensure consistent installs.
