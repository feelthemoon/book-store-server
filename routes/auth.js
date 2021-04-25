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
    check("email", messages.invalidEmailOrPassword).isEmail(),
    check("password", messages.invalidEmailOrPassword).isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
        });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: messages.invalidEmailOrPassword });
      }
      const passwordIsMatch = bcrypt.compare(password, user.password);
      if (!passwordIsMatch) {
        return res.status(400).json({ error: messages.invalidEmailOrPassword });
      }
      const token = jwt.sign(
        { userId: user.id },
        process.env.NODE_APP_JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      return res.status(204).set("Authorization", `Bearer ${token}`).json({});
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
      if (phoneTaken) {
        return res.status(400).json({ phone: messages.takenPhone });
      } else if (emailTaken) {
        return res.status(400).json({ email: messages.takenEmail });
      }
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
