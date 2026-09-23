import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import codeRoutes from "./routes/codeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import runRoutes from "./routes/runRoutes.js";

dotenv.config();

// DNS Servers
dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const app = express();


// ======================
// MIDDLEWARE
// IMPORTANT: Routes se pehle
// ======================

app.use(cors());

app.use(express.json());


// ======================
// HOME ROUTE
// ======================

app.get("/", (req, res) => {
  res.send("Code Editor API Running 🚀");
});


// ======================
// RUN ROUTES
// ======================

app.use("/api/run", runRoutes);


// ======================
// AUTH ROUTES
// ======================

app.use("/api/auth", authRoutes);


// ======================
// CODE ROUTES
// ======================

app.use("/api/codes", codeRoutes);


// ======================
// MONGODB CONNECTION
// ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully ✅");
  })
  .catch((err) => {
    console.log(
      "Database connection failed:",
      err.message
    );

    process.exit(1);
  });


// ======================
// PORT
// ======================

const PORT = process.env.PORT || 5000;


// ======================
// START SERVER
// ======================

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});