const express = require('express');

const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const productRoutes = require("./routes/product.routes");
const warehouseRoutes = require("./routes/warehouse.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const cartRoutes = require("./routes/cart.routes");


const app = express();
app.use(express.json());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/warehouses", warehouseRoutes);
app.use("/api/v1/inventories", inventoryRoutes);
app.use("/api/v1/cart", cartRoutes);


app.use(errorHandler);


module.exports = app;