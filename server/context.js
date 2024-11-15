import jwt from "jsonwebtoken";

export const context = ({ req }) => {
  const token = req.headers.authorization || "";

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded.userId };
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  }

  return { userId: null };
};
