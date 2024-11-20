import jwt from "jsonwebtoken";

export const context = ({ req }) => {
  const token = req.headers.authorization || null;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { userId: decoded };
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  }

  return { userId: null };
};
