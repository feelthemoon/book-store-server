import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
  author: { type: String, required: true },
  book: { type: String, required: true },
});
export default mongoose.model("Books", booksSchema, "Books");
