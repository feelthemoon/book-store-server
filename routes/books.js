import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import Books from "../models/Books.js";

const router = new Router();

router.get("/api/v1/books", authMiddleware, async (req, res) => {
  try {
    const books = (
      await Books.find({})
        .skip(req.query.page * 6)
        .limit(6)
        .exec()
    ).map((book) => {
      return {
        id: book.id,
        book: book.book,
        author: book.author,
        img: book.img,
        genre: book.genre,
        price: book.price,
      };
    });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
router.get("/api/v1/books/:id", authMiddleware, async (req, res) => {
  try {
    const book = await Books.findOne({ id: req.params.id }).exec();
    res.json({
      id: book.id,
      book: book.book,
      author: book.author,
      img: book.img,
      genre: book.genre,
      price: book.price,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
