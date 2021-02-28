// require('dotenv').config()
import dotenv from "dotenv";
dotenv.config();
import express from "express";

import * as tf from "@tensorflow/tfjs-node";

const app = express();

app.get("/", (req, res) => {
  res.send({ msg: "hello", td: tf });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
