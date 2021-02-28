// require('dotenv').config()
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import * as canvas from "canvas";

import * as faceapi from "face-api.js";

import * as tf from "@tensorflow/tfjs-node";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  ]).then(() => {
    console.log("model loded sucessfully");
  });

  res.send("hello world");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
