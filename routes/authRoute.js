// authRoute.js

const express = require("express");
const { getEmail, totalusers, getContact, checkEmail, score, getscore } = require("../controller/userctrl");
<<<<<<< HEAD
const { create_content, get_content_part1, get_content_part2, get_content, deleteInductionContent } = require("../controller/inductionctrl");
=======
>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237

const router = express.Router();

// Define routes with their respective handler functions
router.get("/details", getEmail);
router.get("/totalusers", totalusers);
router.get("/getContact", getContact);
router.post("/checkemail", checkEmail);
router.post("/score",score);
<<<<<<< HEAD
router.get("/getscore/:id",getscore);




// induction Router

router.post("/induction_content",create_content)
router.get("/get_content",get_content)
router.get("/get_content/:id",get_content_part1);
router.delete("/deleteInductionContent/:id",deleteInductionContent);
// router.get("/get_content2/:s_no",get_content_part2);
=======
router.get("/getscore/:id",getscore)

>>>>>>> d8940bb35a9678bb1a54ec07b657ca85095ab237
// Export the router
module.exports = router;
