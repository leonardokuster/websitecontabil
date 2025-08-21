import dotenv from "dotenv";

dotenv.config();

export default {
  secret: process.env.USER_TOKEN || "default-secret",
  expiresIn: "5d"
};
