const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const path = require("path");

// Monogoose DB setup
const mongoose = require("mongoose");

//for routes
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");

mongoose.connect(process.env.MONGO_URL);

const app = express();

const server = http.createServer(app);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  "/uploads/profile_pics",
  express.static(path.join(__dirname, "uploads/profile_pics"))
); //server static profile pics

app.use("/api", userRoutes()); // All routes will be under /api/...
app.use("/api", gameRoutes());


const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", function () {
  console.log(`Server is running on port ${PORT}...`);
});
