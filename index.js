import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./routes/auth.js";
import books from "./routes/books.js";
dotenv.config();
const app = express();

app.use(express.json({ extended: true }));
app.use(function (_, response, next) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", true);
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Cache-Control, Access-Control-Allow-Origin, Authorization"
  );
  response.setHeader("Access-Control-Expose-Headers", "Authorization");
  next();
});
app.post("/login", auth);
app.post("/register", auth);
app.get("/api/v1/books", books);
app.get("/api/v1/books/:id", books);
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
