import mongoose from "mongoose";
import { object } from "zod";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    requied: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const tagSchema = new mongoose.Schema({
  tags: {
    type: String,
    required: true,
    unique: true,
  },
});

const linkSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export const users = mongoose.model("user", userSchema);
export const tag = mongoose.model("tag", tagSchema);
