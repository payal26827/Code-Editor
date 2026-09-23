import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {

    // ==========================================
    // GET AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    // ==========================================
    // CHECK BEARER TOKEN
    // ==========================================

    const parts = authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const token = parts[1];

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "Decoded JWT:",
      decoded
    );

    // ==========================================
    // STORE USER ID
    // ==========================================

    req.userId = decoded.userId;

    // Optional: complete decoded user information
    req.user = decoded;

    // ==========================================
    // CONTINUE
    // ==========================================

    next();

  } catch (error) {

    console.error(
      "Auth Middleware Error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;