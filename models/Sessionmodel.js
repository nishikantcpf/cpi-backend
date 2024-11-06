const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
    {
      
        title: {
            type: String,
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        trainer_name: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        start_time: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        },
        language:{
            type:  String,
            required:true
        },
        state:{
            type:String,
            required:false
        },
        venue:{
            type:String,
            required:false
        },
        venue_google_link: {
            type:String,
            required:false
        },
        zoom_link:{
            type: String,
            required:false
        },
        zoom_password:{
            type: String,
            required:false 
        },
        issession_virtual: {
            type: Boolean,  // Define the field as a boolean
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
