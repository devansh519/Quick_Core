# QuickCore v1

QuickCore v1 is a Node.js backend project built with Express and Mongoose. It provides the foundation for an ecommerce or delivery-oriented API with models for users, products, orders, inventory, warehouses, payments, reviews, deliveries, and related resources.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- JSON Web Tokens

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
    `-- models
        |-- address.model.js
        |-- brand.model.js
        |-- cart.model.js
        |-- category.model.js
        |-- coupon.model.js
        |-- delivery.model.js
        |-- driver.model.js
        |-- inventory.model.js
        |-- notification.model.js
        |-- order.model.js
        |-- orderItem.model.js
        |-- payment.model.js
        |-- product.model.js
        |-- refreshToken.model.js
        |-- review.model.js
        |-- user.model.js
        `-- warehouse.model.js
```

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
```

### Run the Project

Start the development server with nodemon:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

The server runs on:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the server with nodemon
- `npm start` - start the server with Node.js
- `npm test` - placeholder test command

## Notes

- Keep `.env` private and do not commit it.
- Commit `package-lock.json` so installs stay consistent across machines.
