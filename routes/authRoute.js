// authRoute.js

const express = require("express");
const { getEmail, totalusers, getContact, checkEmail, score, getscore } = require("../controller/userctrl");
const { create_content, get_content_part1,  get_content, deleteInductionContent, getDataPartById, meetingsession, getmeetingsession, getmeetingsessionById, sendEmail, sendotp, create_feedback, register_session, userprogress, userprogressadd, getDataPartById_quize,  quiz_completed, genrate_invitation_code, skip_part2 } = require("../controller/inductionctrl");
const { find_all_data, listUsersByState, deleteSession, getFeedback, want_to_be_trainer, trainerApproval } = require("../controller/adminctrl");


const router = express.Router();

// Define routes with their respective handler functions
router.get("/details", getEmail);
router.get("/totalusers", totalusers);
router.get("/getContact", getContact);
router.post("/checkemail", checkEmail);
router.post("/score",score);
router.get("/getscore/:id",getscore);


// induction Router

router.post("/induction_content",create_content);
router.get("/get_content",get_content);
router.get("/get_content/:id",get_content_part1);
router.delete("/deleteInductionContent/:id",deleteInductionContent);
// router.get("/get_content2/:s_no",get_content_part2);
router.get("/getquestion/:id",getDataPartById);
router.post("/sessioncreate",meetingsession);
router.get("/getsession",getmeetingsession);
router.get("/getmeetingsessionById/:id",getmeetingsessionById);
router.post("/sendEmail",sendEmail);
router.post("/sendotp",sendotp);
router.post("/create_feedback",create_feedback);
router.post("/register_session",register_session);
router.post("/userprogressadd",userprogressadd);
router.post("/userprogress",userprogress);
router.get("/getquestion_quize/:id",getDataPartById_quize)
router.post("/quiz_completed",quiz_completed)
router.post("/genrate_invitation_code",genrate_invitation_code);
router.post("/skip_part2",skip_part2);




// Admin route
router.post("/find_all_data",find_all_data);
router.get("/liststate",listUsersByState);
router.delete('/deleteSession/:id',deleteSession);
router.get('/getFeedback',getFeedback);
router.put('/want_to_be_trainer',want_to_be_trainer);
router.put('/trainerapproval',trainerApproval);


// Export the router
module.exports = router;
