require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const b = require("based-blob");
const faceapi = require("face-api.js");
const tf = require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const fileUpload = require("express-fileupload");
const { registerFont, createCanvas } = require("canvas");

const app = express();

// MiddileWare

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
  console.log(req.body);
  console.log(req.files);

  const files = req.files.uploadImage;

  const studentName = req.body.modelName;

  // const result = Promise.all(

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

  // const result = await new faceapi.LabeledFaceDescriptors(
  //   studentName,
  //   description
  // );

 const promise = ()=>{

  return new Promise((resolve,rejects)=>{
     
      resolve(new faceapi.LabeledFaceDescriptors(
        studentName,
        description
      ))

  })

 }  
s

  promise().then((data)=>{ console.log(data); 
     res.status(200).json({ data: result });
  })




});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("server runing in port 3000");
});
