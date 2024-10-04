const { default: mongoose } = require("mongoose");

const mdbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};
module.exports = mdbConnect;