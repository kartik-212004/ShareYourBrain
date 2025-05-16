import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import { users } from "./src/mongo/schema.db.js";
import { middleware } from "./src/middleware/middleware.js";
import { content } from "./src/mongo/schema.db.js";
import { link } from "./src/mongo/schema.db.js";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "./src/config/config.js";
import { z } from "zod";
import cors from "cors";
dotenv.config()

const app = express();
mongoose.connect(process.env.MONGO_URL);
app.use(express.json());
app.use(cors());
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
    if (!isEmailFound) {
      return res.json({ message: "Account Not Found", status: 411 });
    }
    const token = jwt.sign({ id: isEmailFound._id }, JWT_SECRET);
    res.json({ message: "Logged in", token: token, status: 200 });

  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.post("/api/v1/content", middleware, async (req, res) => {
  try {
    let { title, link, tags } = req.body
    await content.create({
      link: link,
      title: title,
      userId: req.userId,
      tags: tags
    })
    res.status(200).json({ message: "success" })

  } catch (error) {
    console.log(error)
    return res.status(411).json({ error: error.message });
  }
});

app.get("/api/v1/content/:userId", middleware, async (req, res) => {
  try {
    const userId = req.params.userId
    let userContent = await content.find({ userId: userId }).populate('userId', "email")
    res.json({ message: "success", data: userContent, status: 200 })

  } catch (error) {
    console.log(error)
    return res.status(411).json({ error: error.message });
  }
});

app.delete("/api/v1/content/:id", middleware, async (req, res) => {
  try {
    const id = req.params.id
    await content.deleteMany({
      _id: id,
    })
    res.json({
      message: "Content deleted successfully"
    })
  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.post("/api/v1/content/share/id", async (req, res) => {
  try {
    const { id, userId } = req.body
    const response = await link.find({
      hash: id,
      userId: userId
    }).populate("userId", "email");

    console.log(response, "getting content link");

    res.json({ message: "Successfully fetched content", data: response, status: 200 });
  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.post("/api/v1/content/share/", middleware, async (req, res) => {
  try {
    const { id, userId } = req.body;
    await link.create({
      hash: id,
      userId: userId
    });
    res.json({ message: "Successfully created link", status: 200, data: { id, userId } });
    console.log(id);
  } catch (error) {
    return res.status(411).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
