import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
dotenv.config();
const app = express();

app.use(express.json({ extended: true }));
app.post("/login", auth);
app.post("/register", auth);
async function start() {
  try {
    await mongoose.connect(process.env.NODE_APP_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(process.env.PORT, () =>
      console.log(`App has been started at port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
}
start();
