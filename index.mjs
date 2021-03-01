// require('dotenv').config()
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cors from "cors";
// Import a fetch implementation for Node.js
import fetch from "node-fetch";

import * as canvas from "canvas";

import * as faceapi from "face-api.js";

import "@tensorflow/tfjs-node";

const app = express();
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(express.static("public"));

app.get("/load", async (req, res) => {
  const MODEL_URL = `./public/models/`;

  faceapi.default.nets.ssdMobilenetv1
    .loadFromDisk(MODEL_URL)
    .then(faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL))
    .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
    .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
    .then(() => console.log("model loaed sucessfully"))
    .catch((error) => {
      console.log(error);
    });
  res.send({ data: "hello" });
});

app.post("/loadimage", async (req, res) => {
  console.log(req.body);

  res.status(200).json({ data: req.body });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
