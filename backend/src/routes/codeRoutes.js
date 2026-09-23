import express from "express";

import {
  createCode,
  getCodes,
  getCodeById,
  updateCode,
  deleteCode,
} from "../controllers/codeController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ================================
// Protected Code Routes
// ================================

// Create new code
router.post("/", protect, createCode);

// Get all codes
router.get("/", protect, getCodes);

// Get code by ID
router.get("/:id", protect, getCodeById);

// Update code
router.put("/:id", protect, updateCode);

// Delete code
router.delete("/:id", protect, deleteCode);

export default router;