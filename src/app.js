const express = require('express');

const authRoutes = require("./routes/auth.routes");


const app = express();
app.use(express.json());


app.use("/api/v1/auth", authRoutes);


app.use(errorHandler);


module.exports = app;