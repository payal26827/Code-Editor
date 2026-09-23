import express from "express";

import {
  runCode,
} from "../controllers/runController.js";

const router = express.Router();

// Run Code
router.post("/", runCode);

export default router;