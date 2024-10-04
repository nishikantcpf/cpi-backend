const express = require("express");
const { uploadImages, deleteImages, uploadImagesname } = require("../controller/uploadcrtl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto,
    // productImgResize
} = require("../middlewares/uploadImage");
<<<<<<< HEAD
const { uploadVideo } = require("../controller/videoupload");
=======
>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
const router = express.Router();

router.post(
    "/",
    // authMiddleware,
    // isAdmin,
    // uploadPhoto.array("images", 10),
    uploadPhoto.single("file"),
    // productImgResize,
    uploadImages
);

router.post(
    "/logo",
    uploadImagesname,

)

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

<<<<<<< HEAD

router.post("/upload-video", uploadVideo);

=======
>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
module.exports = router;