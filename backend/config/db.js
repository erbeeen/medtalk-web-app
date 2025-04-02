const mongoose = require("mongoose");

async function dbConnect() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "medtalk-database"
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = {
  dbConnect,
};
