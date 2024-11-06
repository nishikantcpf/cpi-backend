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
// const checkEmail1 = asyncHandler(async (req, res) => {
//     const { phone, email } = req.body;
    

//     if(phone!=""){
//         try {
//             // Salesforce SOQL query
//             const query = `SELECT Id, Name FROM Lead WHERE phone='${phone}'`;
        
//             conn.query(query, (err, result) => {
//                 if (err) {
//                     console.error("Salesforce query error:", err); // Log the error
//                     return res.status(500).json({ message: "Internal server error" });
//                 }
        
//                 // console.log("Salesforce Query Result:", result); // Log the Salesforce result
        
//                 // Ensure that the query returns records and totalSize is greater than 0
//                 if (result && result.totalSize > 0 && result.records.length > 0) {
//                     const finduserid = result.records[0].Id;
//                     const findusername = result.records[0].Name;
        
//                     // Send response with token
//                     return res.json({
//                         result,
//                         success: true,
//                         token: generateToken(finduserid, findusername),
//                     });
//                 } else {
//                     // No matching record found
//                     return res.status(400).json({ message: "Invalid credentials" });
//                 }
//             });
//         } catch (error) {
//             // Catch any errors outside of the query execution
//             console.error("Catch block error:", error);
//             return res.status(500).json({ message: error.message });
//         }

//     }else{

//         try {
//             // Salesforce SOQL query
//             const query = `SELECT Id, Name FROM Lead WHERE Email = '${email}'`;
        
//             conn.query(query, (err, result) => {
//                 if (err) {
//                     console.error("Salesforce query error:", err); // Log the error
//                     return res.status(500).json({ message: "Internal server error" });
//                 }
        
//                 // console.log("Salesforce Query Result:", result); // Log the Salesforce result
        
//                 // Ensure that the query returns records and totalSize is greater than 0
//                 if (result && result.totalSize > 0 && result.records.length > 0) {
//                     const finduserid = result.records[0].Id;
//                     const findusername = result.records[0].Name;
        
//                     // Send response with token
//                     return res.json({
//                         result,
//                         success: true,
//                         token: generateToken(finduserid, findusername),
//                     });
//                 } else {
//                     // No matching record found
//                     return res.status(400).json({ message: "Invalid credentials" });
//                 }
//             });
//         } catch (error) {
//             // Catch any errors outside of the query execution
//             console.error("Catch block error:", error);
//             return res.status(500).json({ message: error.message });
//         }
//     }
// });



const checkEmail = asyncHandler(async (req, res) => {
    const { phone, email } = req.body;

    // Function to handle Salesforce queries
    const querySalesforce = async (field, value) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT Id, Name, Email FROM Lead WHERE ${field} = '${value}'`;
            conn.query(query, (err, result) => {
                if (err) {
                    // console.error("Salesforce query error:", err);
                    return reject("Internal server error");
                }
                console.log(result)
                // Ensure that records exist
                if (result && result.totalSize > 0 && result.records.length > 0) {
                    const finduserid = result.records[0].Id;
                    const findusername = result.records[0].Name;
                    const finduseremail = result.records[0].Email;
                    console.log(finduseremail)
                    return resolve({ finduserid, findusername, finduseremail });
                } else {
                    return reject("Invalid credentials");
                }
            });
        });
    };

    try {
        let result;
        
        // Check if phone is provided, otherwise use email
        if (phone) {
            result = await querySalesforce('Phone', phone);
        } else if (email) {
            result = await querySalesforce('Email', email);
        } else {
            return res.status(400).json({ message: "Phone or Email is required" });
        }

        // If successful, return token and result
        return res.json({
            success: true,
            token: generateToken(result.finduserid, result.findusername, result.finduseremail),
        });

    } catch (error) {
        // Handle any errors
        if (error === "Invalid credentials") {
            return res.status(400).json({ message: error });
        }
        return res.status(500).json({ message: error });
    }
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
