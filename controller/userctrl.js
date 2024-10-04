// userctrl.js

const asyncHandler = require('express-async-handler');
const conn = require('../config/dbConnect'); // Your database connection file
const { generateToken } = require('../config/jwtToken');

const Score = require('../models/scoremodel');
const InductionContent = require('../models/inductioncontmodel');

// Controller methods

// Handler for fetching emails
const getEmail = asyncHandler(async (req, res) => {
    try {
        conn.query("SELECT Phone FROM Lead", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handler for checking email by phone number it login
const checkEmail = asyncHandler(async (req, res) => {
    const { phone, email } = req.body;
    

    if(phone!=null){
        try {
            conn.query(`SELECT Id, Name FROM Lead WHERE phone='${phone}'`, (err, result) => {
                if (err) throw err;
                
                const finduserid=result.records[0].Id;
                const findusername =result.records[0].Name
                
                if (result.totalSize>0) {
                                // res.send(result);
                                res.json({
                                    result,
                                    success: true,
                                    token: generateToken(finduserid,findusername),
                                });
                            } else {
                                res.status(400).json({ message: "Invalid credentials" });
                            }
                res.send(result);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }else{
        try {
            conn.query(`SELECT Id, Name FROM Lead WHERE email='${email}'`, (err, result) => {
                if (err) throw err;
               
                
                const finduserid=result?.records[0].Id;
                const findusername =result?.records[0].Name
                
                if (result.totalSize>0) {
                                // res.send(result);
                                res.json({
                                    result,
                                    success: true,
                                    token: generateToken(finduserid,findusername),
                                });
                            } else {
                                res.status(400).json({ message: "Invalid credentials" });
                            }
                res.send(result);
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    
    
    // try {
    //     const sql = `SELECT Id, Name FROM Lead WHERE phone='07050515676' `;
    //     conn.query(sql, (err, result) => { 
    //         if (err) throw err;
    //         res.send(result); // Use parameterized query
    //         // if (err) throw err;
    //         // if (result.length > 0) {
    //         //     res.send(result);
    //         // } else {
    //         //     res.status(400).json({ message: "Invalid credentials" });
    //         // }


    //     });
    // } catch (error) {
    //     res.status(500).json({ message: error.message });
    // }
});

// Handler for getting contact information
const getContact = asyncHandler(async (req, res) => {
    try {
        conn.query("SELECT Phone FROM Lead", (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

// Handler for counting total users
const totalusers = asyncHandler(async (req, res) => {
    try {
        conn.query("SELECT COUNT(*) AS total FROM Lead", (err, result) => {  // Corrected COUNT syntax
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const score = asyncHandler(async (req, res) => {
    try {
        // const {id,name,score,attempted}=req.body;
        const data = req.body;
        const userData = await Score.create(data);
    
     res.send("Data added")
        
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});

const getscore = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const getaUser = await Score.findOne({ uid: id });
        res.json(getaUser)
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
});



// Export all controller functions
module.exports = {
    getEmail,
    checkEmail,
    getContact,
    totalusers,
    score,
    getscore,
    
};
