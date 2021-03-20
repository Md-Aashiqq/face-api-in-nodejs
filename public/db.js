
const mongoose = require("mongoose");



module.exports = mongoose.connect(
  "mongodb+srv://iammac:Md.aashiqq.2801@cluster0.utz7t.mongodb.net/faceapi?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  }
);