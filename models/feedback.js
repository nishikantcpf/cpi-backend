const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const feedbackSchema = new mongoose.Schema(
    {
        engagement_Rating: {
            type:Number,
            required: true
        },
        quality_Rating:{
            type:Number,
            required: true
        },
        comment:{
            type:String,
            required: true,
        },
        uid:{
            type:String,
            required: true,
        },
        session_id:{
            type:String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;

//Export the model
