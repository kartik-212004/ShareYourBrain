import mongoose from "mongoose";
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

const contentSchema = new mongoose.Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "tags" }],
  userId: { type: mongoose.Types.ObjectId, ref: "user", required: true }
});

export const users = mongoose.model("user", userSchema);
export const tag = mongoose.model("tags", tagSchema);
export const link = mongoose.model("link", linkSchema);
export const content = mongoose.model("content", contentSchema);
 