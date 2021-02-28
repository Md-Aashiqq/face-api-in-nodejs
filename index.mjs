// require('dotenv').config()
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";

// Import a fetch implementation for Node.js
import fetch from "node-fetch";

import * as canvas from "canvas";

import * as faceapi from "face-api.js";

import "@tensorflow/tfjs-node";

// Make face-api.js use that fetch implementation
faceapi.env.monkeyPatch({ fetch: fetch });

const app = express();

app.use(express.static("public"));

app.get("/", async (req, res) => {
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
