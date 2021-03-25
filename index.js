require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const faceapi = require("face-api.js");
const tf = require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const fileUpload = require("express-fileupload");
const { registerFont, createCanvas } = require("canvas");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://iammac:Md.aashiqq.2801@cluster0.utz7t.mongodb.net/faceapi?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  }
);
const DataModel = require("./models/data");

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
app.use(fileUpload());
app.use(express.static("public"));

// mokey pathing the faceapi canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const faceDetectionNet = faceapi.nets.ssdMobilenetv1;

const MODEL_URL = `./public/models/`;

faceapi.nets.ssdMobilenetv1
  .loadFromDisk(MODEL_URL)
  .then(faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL))
  .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
  .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
  .then(() => console.log("model loaed sucessfully"))
  .catch((error) => {
    console.log(error);
  });

// SsdMobilenetv1Options
const minConfidence = 0.5;

// TinyFaceDetectorOptions
const inputSize = 408;
const scoreThreshold = 0.5;

// MtcnnOptions
const minFaceSize = 50;
const scaleFactor = 0.8;

function getFaceDetectorOptions(net) {
  return net === faceapi.nets.ssdMobilenetv1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : net === faceapi.nets.tinyFaceDetector
    ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor });
}
const faceDetectionOptions = getFaceDetectorOptions(faceDetectionNet);

app.get("/load", async (req, res) => {
  res.send({ data: "hello" });
});

app.post("/loadimage", async (req, res, next) => {
  console.log("start");
  const files = req.files.uploadImage;
  const studentName = req.body.modelName;
  const description = [];
  for (const file of files) {
    const img = await canvas.loadImage(file.data);

    const myCanvas = canvas.createCanvas(200, 200);
    const ctx = myCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 200, 200);

    const detection = await faceapi
      .detectSingleFace(myCanvas, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log(detection);

    description.push(detection.descriptor);
  }

  const result = new faceapi.LabeledFaceDescriptors(studentName, description);

  console.log(result);

  const stotreData = {
    clsName: "cseA",
    data: result,
  };

  const data = await DataModel.create(stotreData);
  res.status(200).json({ data: data });
});

// Get DB Data

app.get("/getData", async (req, res) => {
  const data = await DataModel.find({ clsName: "cseA" });
  res.status(200).json({ data: data });
});

app.post("/compareImage", async (req, res) => {
  const files = req.files.uploadImage;
  const clsName = req.body.clsName;
  try {
    const DBdata = await DataModel.find(
      { clsName: "cseA" },
      { data: 1, _id: 0 }
    );

    // faceFaceDescriptors = [];

    // DBdata.forEach((element) => {
    //   console.log("start");
    //   console.log(element.data._label);
    //   const result = new faceapi.LabeledFaceDescriptors(
    //     element.data._label,
    //     element.data._descriptors
    //   );
    //   faceFaceDescriptors.push(result);
    // });
    // console.log(faceFaceDescriptors);

    // console.log("faceMatcher");
    // const faceMatcher = faceapi.FaceMatcher(faceFaceDescriptors, 0.6);
    // console.log(faceMatcher);

    console.log("loadImge");
    const img = await canvas.loadImage(uploadImage.data);
    const myCanvas = canvas.createCanvas(200, 200);
    const ctx = myCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 200, 200);
    console.log("detection");
    const detection = await faceapi
      .detectAllFaces(myCanvas, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();
    console.log(detection);

    res.status(200).json({ data: DBdata });
  } catch (e) {}
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
