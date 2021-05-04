import jwt from "jsonwebtoken";
export default function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No authorization" });
    }

    const decoded = jwt.verify(token, process.env.NODE_APP_JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    res.status(401).json({ message: "No authorization" });
  }
}
