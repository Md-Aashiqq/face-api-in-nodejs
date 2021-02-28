import express from "express";

import "@tensorflow/tfjs-node";

const app = express();


app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(3001, () => {
  console.log("server runing in port 3000");
});
