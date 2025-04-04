// main file
// npm init, install - node, express, mongoose, express-validator

const connectToMongodb = require("./db");
const express = require("express");

connectToMongodb(); // connected to db by calling a function written in db.js

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // middleware used for using res.body content

// all ports
app.use('/api/notes/', require('./routes/allNotes'));


app.listen(port, () => {
    console.log(`app is listening to the port: ${port}`);
});