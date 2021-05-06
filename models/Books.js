import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  author: { type: String, required: true },
  book: { type: String, required: true },
  id: { type: Number, required: true },
  img: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
});
export default mongoose.model("Books", booksSchema, "Books");
