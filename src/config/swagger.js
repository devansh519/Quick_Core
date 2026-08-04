const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "QuickCore API",
            version: "1.0.0",
            description:
                "AI-Native Quick Commerce Operations Platform API Documentation",
            contact: {
                name: "QuickCore",
            },
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
                description: "Local Development Server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],

        tags: [
            {
                name: "Authentication",
                description: "Authentication APIs",
            },
            {
                name: "Products",
                description: "Product Management",
            },
            {
                name: "Categories",
                description: "Category Management",
            },
            {
                name: "Brands",
                description: "Brand Management",
            },
            {
                name: "Inventory",
                description: "Inventory Management",
            },
            {
                name: "Warehouses",
                description: "Warehouse Management",
            },
            {
                name: "Orders",
                description: "Order Management",
            },
            {
                name: "Cart",
                description: "Shopping Cart",
            },
            {
                name: "Payments",
                description: "Payment APIs",
            },
            {
                name: "Drivers",
                description: "Driver Management",
            },
            {
                name: "Deliveries",
                description: "Delivery Management",
            },
            {
                name: "Notifications",
                description: "Notification APIs",
            },
        ],
    },

    apis: [
        "./src/routes/*.js",
        "./src/docs/**/*.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            explorer: true,
            customSiteTitle: "QuickCore API Docs",
        })
    );
}

module.exports = setupSwagger;