// models/Video.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    name: String,
    videoUrl: String,  // This will store the link to the uploaded video file
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Video", videoSchema);
