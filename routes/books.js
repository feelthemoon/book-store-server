import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Books from "../models/Books.js";

const router = new Router();

router.get("/api/v1/books", authMiddleware, async (req, res) => {
  try {
    let books = [];
    await Books.find((_, items) => {
      books = items.slice(req.query.page * 20, req.query.page * 20 + 20);
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.get("/api/v1/books/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Books.findOne({ _id: req.params.id }).exec();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
