// userctrl.js

const asyncHandler = require('express-async-handler');
const conn = require('../config/dbConnect'); // Your database connection file
const { generateToken } = require('../config/jwtToken');
const InductionContent = require('../models/inductioncontmodel');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');

// Controller methods



const create_content = asyncHandler(async(req,res)=>{
    try {
        const data = req.body;
        const userData = await InductionContent.create(data);
        res.send(userData)
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});
const get_content = asyncHandler(async (req, res) => {
  try {
      const { s_no } = req.params;
      const getaUser = await InductionContent.find();
      res.json(getaUser)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

const get_content_part1 = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const getaUser = await InductionContent.findOne({ _id: id });
        res.json(getaUser)
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});
const get_content_part2 = asyncHandler(async (req, res) => {
  try {
      const { s_no } = req.params;
      const getaUser = await InductionContent.findOne({ s_no: s_no }).where({part:"2"});
      res.json(getaUser)
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

const deleteInductionContent = async (req, res) => {
  try {
      const id = req.params.id;
      const contentToDelete = await InductionContent.findById(id);
     
      if (!contentToDelete) {
          return res.status(404).json({ message: 'Induction content not found' });
      }
      const videodataToDelete= await Video.findOne({videoUrl:contentToDelete.video_link})
      

      // Extract video filename from the video_link field
      const videoFileName = path.basename(contentToDelete.video_link);
      const videoFilePath = path.join(__dirname, '..', 'uploads', 'videos', videoFileName);

      // Delete video file from the uploads/video folder
      fs.unlink(videoFilePath, (err) => {
          if (err && err.code !== 'ENOENT') {
              // If error occurs, but not because the file doesn't exist, return an error
              return res.status(500).json({ message: 'Error deleting video file', error: err.message });
          }

          // After video deletion, delete the document from the database
          contentToDelete.deleteOne();
          videodataToDelete.deleteOne();

          return res.status(200).json({ message: 'Induction content and video deleted successfully' });
      });
  } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all controller functions
module.exports = {
    create_content,
    get_content,
    get_content_part1,
    get_content_part2,
    deleteInductionContent,
};
