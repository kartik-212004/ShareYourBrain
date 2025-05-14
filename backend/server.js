import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { users } from "./src/mongo/schema.db.js";
import { middleware } from "./src/middleware/middleware.js";
import { JWT_SECRET } from "./src/config/config.js";
import { z } from "zod";
dotenv.config()

const app = express();
mongoose.connect(process.env.MONGO_URL);
app.use(express.json());
app.use(middleware)

const zodUser = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Short password"),
});

app.post("/api/v1/signup", async (req, res) => {
  try {
    zodUser.parse(req.body);
    const { email, password } = req.body;

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(411).json({ message: "User already exists" });
    }
    await users.create({ email, password });

    return res.status(200).json({ message: "Account successfully created" });
  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    zodUser.parse(req.body);
    let isEmailFound = await users.findOne({
      email: email,
      password: password,
    });
    console.log(isEmailFound);
    if (!isEmailFound) {
      return res.json({ message: "Account Not Found", status: 411 });
    }

    res.json({ message: "Logged in", status: 200 });

  } catch (error) { }
});

app.post("/api/v1/content", async (req, res) => {
  try {

    // let { title, links, tags }  
  } catch (error) { }
});

app.get("/api/v1/content", async (req, res) => {
  try {
  } catch (error) { }
});

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
