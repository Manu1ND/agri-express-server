// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection

const mongoDB = "mongodb+srv://admin:ZRBhcSlRodbOYmlE@cluster0.g936nmg.mongodb.net/agri_services?retryWrites=true&w=majority";
//const mongoDB = "mongodb://admin:ZRBhcSlRodbOYmlE@ac-jjx9jpb-shard-00-00.g936nmg.mongodb.net:27017,ac-jjx9jpb-shard-00-01.g936nmg.mongodb.net:27017,ac-jjx9jpb-shard-00-02.g936nmg.mongodb.net:27017/?ssl=true&replicaSet=atlas-pbjf98-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("connected", () => {
  console.log("Database Connected");
});
