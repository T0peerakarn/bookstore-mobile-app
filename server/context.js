import jwt from "jsonwebtoken";

export const context = ({ req }) => {
  const token = req.headers.authorization || "";

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      return { userId: decoded.userId };
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  }

  return { userId: null };
};
