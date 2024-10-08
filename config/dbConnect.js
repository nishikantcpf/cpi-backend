
const jsforce = require('jsforce');
require('dotenv').config();

const conn = new jsforce.Connection({
    loginUrl: process.env.SF_LOGIN_URL
});

conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD+process.env.SF_TOKEN, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Salesforce connection established.');
    }
});

module.exports = conn;