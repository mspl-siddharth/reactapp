import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import AllRouters from "./routers/routers.js";
import cors from "cors";

const app = express();

dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "http://192.168.10.113:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to backend server");
});

app.use("/api", AllRouters);

mongoose.connect(process.env.MONGODBURL).then(() => {
  console.log("MongoDB Connected");
});

app.listen(8000, "0.0.0.0", () =>
  console.log("Server is running on port 8000")
);
