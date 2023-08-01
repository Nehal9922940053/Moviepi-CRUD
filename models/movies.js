const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    movie_name:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        required:true,
    },
    released:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },
});
module.exports = mongoose.model("Movie", movieSchema);