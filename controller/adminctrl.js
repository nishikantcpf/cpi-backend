const asyncHandler = require('express-async-handler');
const conn = require('../config/dbConnect');
const { generateToken } = require('../config/jwtToken');


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






// Export all controller functions
module.exports = {
    find_all_data,
    listUsersByState
};