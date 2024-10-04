const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const scoreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        uid:{
            type:String,
            required: true,
            unique: true,
        },
        score:{
            type:Number,
            required: true
        },
       
    },
    {
        timestamps: true,
    }
);



//Export the model
module.exports = mongoose.model('Score', scoreSchema);