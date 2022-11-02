const express = require('express')
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();
//Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files
const multer = require("multer");
const { AppConfig } = require('aws-sdk');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect("mongodb+srv://functionup:deep982@cluster0.r0zd4.mongodb.net/nodeAssignment", {
        useNewUrlParser: true //not denay new string to connect database
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});//process.env set the environment of the port 