const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const registerSchema = new mongoose.Schema(
    {
        uid:{
            type:String,
            required: true,
        },
        session_id:{
            type:String,
            required: true,
        },
        rescheduleCount:{
            type:Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Register = mongoose.model('Register', registerSchema);

module.exports = Register;

//Export the model
