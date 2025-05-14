import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { users } from "./src/mongo/schema.db.js";
import { middleware } from "./src/middleware/middleware.js";
import { content } from "./src/mongo/schema.db.js";
import { JWT_SECRET } from "./src/config/config.js";
import { z } from "zod";
dotenv.config()

const app = express();
mongoose.connect(process.env.MONGO_URL);
app.use(express.json());

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
    const token = jwt.sign({ id: isEmailFound._id }, JWT_SECRET);
    console.log(token)
    res.json({ message: "Logged in", token: token, status: 200 });

  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.post("/api/v1/content", middleware, async (req, res) => {
  try {
    let { title, links, tags } = req.body
    await content.create({
      link: links,
      title: title,
      userId: req.userId,
      tags: tags
    })
    res.status(200).json({ message: "success" })

  } catch (error) {
    console.log(error)
  }
});

app.get("/api/v1/content", middleware, async (req, res) => {
  try {
  } catch (error) {

  }
});

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
