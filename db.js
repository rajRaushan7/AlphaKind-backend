// write a function to connect with db and then export it to use in index.js

const mongoose = require("mongoose");
const mongoURI = 'mongodb+srv://raj1618192:zNZufSheuGHCIZbp@cluster0.mbphveh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectToMongodb = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("connected to DateBase");
    } catch (error) {
        console.error("Error connecting to db: ", error);
    }
}

module.exports = connectToMongodb;