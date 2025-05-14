import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { users } from "./mongo/schema.db";
import path from "path";
import { z } from "zod";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
mongoose.connect(process.env.MONGO_URL!);
app.use(express.json());

interface Credentials {
  email: string;
  password: string;
}

const zodUser = z.object({
  email: z.string().email(),
  password: z.string().min(6, "short password"),
});

app.post("api/v1/signup", async (req, res) => {
  try {
    zodUser.parse(req.body);
    const { email, password }: Credentials = req.body;

    let isUniqueEmail = await users.findOne({
      email: email,
    });

    if (isUniqueEmail) {
      res.json({ message: "user already exists", status: 400 });
    }

    console.log(email);
    const newUser = new users({ email, password });
    await newUser.save();

    res.json({
      message: "Account successfully created",
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post("api/v1/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    zodUser.parse(req.body);
    let isEmailFound = await users.findOne({
      email: email,
      password: password,
    });
    console.log(isEmailFound);
    if (isEmailFound) res.json({ message: "Logged in", status: 200 });
    else {
      res.json({ message: "Account Not Found", status: 400 });
    }
  } catch (error) {}
});

app.post("api/v1/content", async (req, res) => {
  try {
  } catch (error) {}
});
app.listen(process.env.PORT!);
