// authRoute.js

const express = require("express");
const { getEmail, totalusers, getContact, checkEmail, score, getscore } = require("../controller/userctrl");

const router = express.Router();

// Define routes with their respective handler functions
router.get("/details", getEmail);
router.get("/totalusers", totalusers);
router.get("/getContact", getContact);
router.post("/checkemail", checkEmail);
router.post("/score",score);
router.get("/getscore/:id",getscore)

// Export the router
module.exports = router;
