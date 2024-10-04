const mongoose = require('mongoose');

const inductioncontSchema = new mongoose.Schema(
    {
        s_no: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        part: {
            type: Number,
            required: true
        },
        video_link: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const InductionContent = mongoose.model('InductionContent', inductioncontSchema);

module.exports = InductionContent;
