import { Router } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import messages from "../utils/responseMessages.js";
const router = Router();

router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          email: messages.invalidEmailOrPassword,
        });
      }
      const { email, password, rememberMe } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ email: messages.invalidEmailOrPassword });
      }
      const passwordIsMatch = await bcrypt.compare(password, user.password);
      if (!passwordIsMatch) {
        return res.status(400).json({ email: messages.invalidEmailOrPassword });
      }
      const tokenAlive = rememberMe ? "168h" : "24h";
      const token = jwt.sign(
        { userId: user.id },
        process.env.NODE_APP_JWT_SECRET,
        {
          expiresIn: tokenAlive,
        }
      );
      return res.status(200).set("Authorization", `Bearer ${token}`).json({});
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);
router.post(
  "/register",
  [
    check("email", messages.invalidEmail).isEmail(),
    check("phone", messages.invalidPhone).isMobilePhone(),
    check("password", messages.invalidLengthPassword).isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { email, phone } = req.body;
      const phoneTaken = await User.findOne({ phone });
      const emailTaken = await User.findOne({ email });
      const takenErrors = {};
      if (phoneTaken) {
        takenErrors["phone"] = messages.takenPhone;
      }
      if (emailTaken) {
        takenErrors["email"] = messages.takenEmail;
      }
      if (Object.keys(takenErrors).length)
        return res.status(400).json(takenErrors);
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      const user = new User({ ...req.body, password: hashedPassword });
      await user.save();
      const token = jwt.sign(
        { userId: user.id },
        process.env.NODE_APP_JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      res.status(201).set("Authorization", `Bearer ${token}`).json({});
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);
export default router;
