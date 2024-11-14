const asyncHandler = require('express-async-handler');
const conn = require('../config/dbConnect');
const { generateToken } = require('../config/jwtToken');
const Session = require('../models/Sessionmodel');
const Feedback = require('../models/feedback');
const Userprogress = require('../models/userprogressmodel');


const find_all_data = asyncHandler(async (req, res) => {
    const { phone, email } = req.body;

    // Function to get all fields for the Lead object dynamically
    const getAllLeadFields = async () => {
        return new Promise((resolve, reject) => {
            conn.describe("Lead", (err, metadata) => {
                if (err) {
                    console.error("Salesforce describe error:", err);
                    return reject("Internal server error");
                }
                const fields = metadata.fields.map(field => field.name);
                resolve(fields.join(", "));
            });
        });
    };

    // Function to query Salesforce using all fields
    const querySalesforce = async (field, value, allFields) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT ${allFields} FROM Lead WHERE ${field} = '${value}'`;
            conn.query(query, (err, result) => {
                if (err) {
                    console.error("Salesforce query error:", err);
                    return reject("Internal server error");
                }

                if (result && result.totalSize > 0 && result.records.length > 0) {
                    return resolve(result.records[0]);  // Return all fields of the record
                } else {
                    return reject("Invalid credentials");
                }
            });
        });
    };

    try {
        let result;
        const allFields = await getAllLeadFields();

        // Check if phone is provided, otherwise use email
        if (phone) {
            result = await querySalesforce('Phone', phone, allFields);
        } else if (email) {
            result = await querySalesforce('Email', email, allFields);
        } else {
            return res.status(400).json({ message: "Phone or Email is required" });
        }

        // If successful, return token and all data
        return res.json({
            success: true,
            token: generateToken(result.Id, result.Name, result.Email),
            data: result  // Include all lead data in response
        });

    } catch (error) {
        if (error === "Invalid credentials") {
            return res.status(400).json({ message: error });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
});


const listUsersByState = asyncHandler(async (req, res) => {
    // Query to retrieve all users with state information from Salesforce
    const querySalesforceForAllUsers = async () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT Id, State FROM Lead WHERE State != NULL`;  // Retrieve all records with a non-null state
            conn.query(query, (err, result) => {
                if (err) {
                    console.error("Salesforce query error:", err);
                    return reject("Internal server error");
                }

                // Map to only states to analyze user distribution by state
                const userStates = result.records.map(record => record.State);
                resolve(userStates);
            });
        });
    };

    try {
        // Fetch all user states from Salesforce
        const userStates = await querySalesforceForAllUsers();

        // Count users in each state
        const stateCounts = userStates.reduce((acc, state) => {
            acc[state] = (acc[state] || 0) + 1;
            return acc;
        }, {});

        // Convert the result into an array of { state, count } objects
        const stateList = Object.entries(stateCounts).map(([state, count]) => ({
            state,
            count
        }));

        // Sort by count in descending order to see the state with the most users first
        stateList.sort((a, b) => b.count - a.count);

        // Send the list of states and user counts
        return res.json({
            success: true,
            states: stateList
        });

    } catch (error) {
        // Handle any errors
        return res.status(500).json({ message: "Internal server error" });
    }
});

const deleteSession = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the session by ID and delete it
        const session = await Session.findByIdAndDelete(id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getFeedback = async (req, res) => {
    try {

          // Retrieve all user progress data
    const wish_to_trainer = await Userprogress.find();
    // console.log(wish_to_trainer)

    // Map user progress data to a dictionary with user IDs as keys
    const wishMap = wish_to_trainer.reduce((map, entry) => {
        map[entry.uid] = entry.wishtotraniner; // Assuming `uid` is the identifier
        return map;
    }, {});

    // Map user progress data to a dictionary with user IDs as keys
    const approvedMap = wish_to_trainer.reduce((map, entry) => {
        map[entry.uid] = entry.trainerapproved; // Assuming `uid` is the identifier
        return map;
    }, {});

        // Find the session by ID and delete it
        const feedback = await Feedback.find();

        const ids = feedback.map((value)=>(value.uid))
        const leadData = await conn.sobject("Lead")
            .find({ Id: { $in: ids } }) // Query for IDs in the retrieved array
            .execute();
            const leadMap = leadData.reduce((map, lead) => {
                map[lead.Id] = lead.Name;
                return map;
            }, {});
            const mergedData = feedback.map((feedback) => ({
                ...feedback.toObject(),
                Name: leadMap[feedback.uid] || 'Not found', // Add name if it exists
                wishtotraniner: wishMap[feedback.uid],

                trainerapproved:approvedMap[feedback.uid] || 'Not found',
                
            }));
        res.status(200).json({mergedData });
        // res.status(200).json({wish_to_trainer_data });
    } catch (error) {
        console.error('Error :', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// const getFeedback = async (req, res) => {
//     try {
//         // Retrieve all user progress data
//         const wish_to_trainer = await Userprogress.find();

//         // Map user progress data to a dictionary with user IDs as keys, including both wishtotraniner and trainerapproved
//         const wishMap = wish_to_trainer.reduce((map, entry) => {
//             map[entry.uid] = {
//                 wishtotraniner: entry.wishtotraniner,  // Assuming this field exists
//                 trainerapproved: entry.trainerapproved // Assuming this field exists
//             };
//             return map;
//         }, {});

//         // Retrieve all feedback data
//         const feedback = await Feedback.find();

//         // Extract user IDs from feedback entries
//         const ids = feedback.map(value => value.uid);

//         // Retrieve Lead data based on the extracted IDs
//         const leadData = await conn.sobject("Lead")
//             .find({ Id: { $in: ids } })
//             .execute();

//         // Map Lead data to a dictionary with IDs as keys
//         const leadMap = leadData.reduce((map, lead) => {
//             map[lead.Id] = lead.Name;
//             return map;
//         }, {});

//         // Merge feedback with lead and wish data
//         const mergedData = feedback.map((feedback) => ({
//             ...feedback.toObject(),
//             Name: leadMap[feedback.uid] || 'Not found', // Add name if it exists
//             wishtotraniner: wishMap[feedback.uid]?.wishtotraniner || 'No', // Access wishtotraniner
//             trainerapproved: wishMap[feedback.uid]?.trainerapproved || 'Not approved' // Access trainerapproved
//         }));

//         // Send the merged data as the response
//         res.status(200).json({ mergedData });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

const want_to_be_trainer =async (req,res)=>{
    const {  uid,wishtotrainer } = req.body;
  
    try {
        
        // If valid, proceed to update user status or create user
        let user = await Userprogress.findOne({ uid });
        if (!user) {
           console.log('No user found')
        } else {
            user.wishtotraniner = wishtotrainer;
        }
  
        await user.save();
        res.status(200).json({ message: "data is submitted" });
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
  }


  const trainerApproval  =async (req,res)=>{
    const {  uid,approval } = req.body;
  
    try {
        
        // If valid, proceed to update user status or create user
        let user = await Userprogress.findOne({ uid });
        if (!user) {
           console.log('No user found')
        } else {
            user.trainerapproved = approval;
        }
  
        await user.save();
        res.status(200).json({ message: "data is submitted" });
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
  }






// Export all controller functions
module.exports = {
    find_all_data,
    listUsersByState,
    deleteSession,
    getFeedback,
    want_to_be_trainer,
    trainerApproval
};