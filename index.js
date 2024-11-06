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
const fs = require("fs");
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
app.use("/uploads/videos", express.static(path.join(__dirname, "/uploads/videos")));
if (!fs.existsSync(path.join(__dirname, "/image"))) {
    fs.mkdirSync(path.join(__dirname, "/image"));
}


app.use("/api/user", authRouter);
app.use("/api/upload", uploadRouter);

// Fallback route for unmatched routes
app.use("/", (req, res) => {
    res.send("Not Found! You are lost.");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
