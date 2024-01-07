const express = require('express')
const cookieparser = require('cookie-parser');
const app = express();
// const fileUpload = require("express-fileupload");
app.use(cookieparser());

app.use(express.json());
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, 
    Accept, x-client-key, x-client-token, x-client-secret, Authorization");
      next();
    });

const errorMiddleware = require('./middleware/error')

//route import
const notes= require('./routes/userRoute');
app.use("/api/v1",notes);


//middleware for error
app.use(errorMiddleware);
module.exports = app;
