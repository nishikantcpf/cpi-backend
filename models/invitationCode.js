// Models/InvitationCode.js
const mongoose = require('mongoose');

const invitationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    contentid:{type:String, required:true},
    allowedEmails: [{ type: String, required: true }], // List of authorized emails
    isValid: { type: Boolean, default: true },
});

const InvitationCode = mongoose.model('InvitationCode', invitationCodeSchema);

module.exports = InvitationCode;

// module.exports = mongoose.model('InvitationCode', invitationCodeSchema);
