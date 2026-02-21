const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const path = require("path");

// Monogoose DB setup
const mongoose = require("mongoose");

//for routes
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const gameUploadRoutes = require("./routes/gameUploadRoutes");

mongoose.connect(process.env.MONGO_URL);

const app = express();

const server = http.createServer(app);

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin EXACT
    credentials: true, // allow cookies
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  "/uploads/profile_pics",
  express.static(path.join(__dirname, "uploads/profile_pics")),
); //server static profile pics

app.use("/api", userRoutes()); 
app.use("/api", gameRoutes());
app.use("/api", gameUploadRoutes());
app.use("/api", require("./routes/testUpload"));

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", function () {
  console.log(`Server is running on port ${PORT}...`);
});
