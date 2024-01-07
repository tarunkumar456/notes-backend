const app = require('./app')
const cors = require('cors');
// app.use(function (request, response, next) {
//   response.header("Access-Control-Allow-Origin", "https://notes-frontend-zeta.vercel.app");
//   response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
// app.use(
//   cors({
//     "credentials":true,
//     "origin":"*",
//     "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//     "optionsSuccessStatus": 204
//   })
// );
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://notes-frontend-zeta.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

app.get("/", (req, res) => {
    res.json("Hello");
})

//------for port from env file--------
const dotenv = require('dotenv');
const connectdatabase = require("./config/database")
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "./config/config.env" });
}

connectdatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working at http://localhost:${process.env.PORT}`);
});

//handling uncaught exception
process.on("uncaughtException", err => {
    console.log(`Error:${err.message}`);
    console.log("shutting down server due to uncaught error")
    server.close(() => {
        process.exit(1);
    })
})
//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error:${err.message}`);
    console.log("shutting down server due to unhandled error")
    server.close(() => {
        process.exit(1);
    })
})
