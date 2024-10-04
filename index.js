const express = require('express');
const dotenv = require("dotenv").config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");
const multer = require('multer');
const authRouter = require('./routes/authRoute');
const uploadRouter = require('./routes/uploadRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const mdbConnect = require('./config/mdbConnect');
<<<<<<< HEAD
const fs = require("fs");
=======

>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
const app = express();
const PORT = process.env.PORT;
mdbConnect();
// Middleware
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file access
app.use("/api/images", express.static(path.join(__dirname, "/images")));
app.use("/image", express.static(path.join(__dirname, "/image")));
<<<<<<< HEAD
app.use("/uploads/videos", express.static(path.join(__dirname, "/uploads/videos")));
if (!fs.existsSync(path.join(__dirname, "/image"))) {
    fs.mkdirSync(path.join(__dirname, "/image"));
}


=======

// Multer for file uploads
var maxSize = 20 * 1024 * 1024; // 20MB
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./image");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
});

// Routes
>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
app.use("/api/user", authRouter);
app.use("/api/upload", uploadRouter);

// Fallback route for unmatched routes
app.use("/", (req, res) => {
    res.send("Not Found! You are lost.");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

<<<<<<< HEAD
// temp
// let videos = [
//     {
//         id: 1,
//         title: 'Video 1',
//         description: 'Description for Video 1',
//         url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         // url: 'https://drive.google.com/file/d/1yISicbMR-TAV0Lb7YZQJ3Hrncds0Etfb/view?usp=sharing',
//         watched: false
//     },
//     {
//         id: 2,
//         title: 'Video 2',
//         description: 'Description for Video 2',
//         url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         watched: false
//     },
//     {
//         id: 3,
//         title: 'Video 3',
//         description: 'Description for Video 3',
//         url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         watched: false
//     },
//     {
//         id: 4,
//         title: 'Video 4',
//         description: 'Description for Video 4',
//         url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         watched: false
//     },
//     {
//         id: 5,
//         title: 'Video 5',
//         description: 'Description for Video 5',
//         url: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         watched: false
//     },
// ];

// app.get('/user/videos', (req, res) => {
//     res.json("videos");
// });



// temp end

=======
>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
// Server listening
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
