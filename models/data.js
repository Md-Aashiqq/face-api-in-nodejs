const mongoose = require("mongoose");


const dataSchema = mongoose.Schema({

    clsName :{
        type:String,
        required:['Please Provied The class Name',true]
    },
    data:{
        type:[Object]
    },


})


const DataModel = mongoose.Model('DataModel',dataSchema);

module.exports = DataModel;


