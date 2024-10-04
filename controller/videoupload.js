// controllers/videoController.js
const multer = require("multer");
const path = require("path");
const Video = require("../models/Video");

// Multer configuration for handling video file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/videos"); // Directory where videos will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename the file to avoid conflicts
    }
});

// Multer upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 2 * 1024 * 1024 }, // 500MB limit for video files
    fileFilter: (req, file, cb) => {
        const filetypes = /mp4|mkv|avi|mov/; // Acceptable video formats
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Videos Only!");
        }
    }
}).single("video"); // Expecting 'video' field in the form-data

// Upload and save video controller
exports.uploadVideo = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Save video link to MongoDB
        try {
            const videoUrl = `/uploads/videos/${req.file.filename}`;
            const newVideo = new Video({
                name: req.body.name || req.file.originalname,
                videoUrl
            });

            const savedVideo = await newVideo.save();
            res.status(200).json({
                message: "Video uploaded successfully",
                video: savedVideo
            });
        } catch (error) {
            res.status(500).json({ message: "Error saving video to database", error });
        }
    });
};
