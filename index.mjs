// require('dotenv').config()
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import * as canvas from "canvas";

import * as faceapi from "face-api.js";

import * as tf from "@tensorflow/tfjs-node";

const app = express();

app.use(express.static("public"));

const loadModel = async () => {
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk("./models"),
    faceapi.nets.faceLandmark68Net.loadFromDisk("./models"),
    faceapi.nets.ssdMobilenetv1.loadFromDisk("./models"),
  ])
    .then(() => {
      console.log("model loded sucessfully");
    })
    .catch((err) => {
      console.log("load models faile");
    });
};

app.get("/", (req, res) => {
  loadModel();

  res.send("hello world");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
