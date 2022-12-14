///////////////////////////
// Environmental Variables
///////////////////////////
require("./envfunc")();
const {
  PORT = 3000,
  SECRET = "secret",
  NODE_ENV = "development"
} = process.env;
console.log(PORT);

//CORS
const cors = require("cors");
const corsOptions = require("./configs/cors.js");

//AUTH
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { auth } = require("./configs/auth.js");

//Bringing in Express
const express = require("express");
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Database
require("./DB/db");

//OTHER IMPORTS
const session = require("express-session");
const morgan = require("morgan");

const farmerRoute = require("./routes/farmer");
const supplierRoute = require("./routes/supplier");
const workerRoute = require("./routes/worker");
const productRoute = require("./routes/product");
const productOrderRoute = require("./routes/productOrder");
const jobRoute = require("./routes/job");
const jobOfferRoute = require("./routes/jobOffer");
const issueRoute = require("./routes/issue");

////////////
//MIDDLEWARE
////////////
NODE_ENV === "production" ? app.use(cors(corsOptions)) : app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("tiny")); //logging

///////////////
//Routes and Routers
//////////////
app.get("/", (req, res) => {
  //res.json({ hello: "Hello World!" });
  res.render('index');
});


//These routes are to generate a test JWT and test out your auth function from auth.js
app.get("/testauth", auth(SECRET), (req, res) => {
  res.json(req.payload);
});

app.get("/testjwt", (req, res) => {
  const token = jwt.sign({ hello: "world" }, SECRET);
  res.json({ token });
});

/* app.get("/testjwt", (req, res) => {
  const token = jwt.sign({ hello: "world" }, SECRET);
  const callbackurl = decodeURI(req.query.callbackurl);
  axios
  .post(callbackurl, { token })
  .then(resPost => {
    console.log(`Status: ${resPost.status}`)
    console.log('Body: ', resPost.data)
    res.json(resPost.data);
  })
  .catch(err => {
    console.error(err)
    res.send(err);
  });
}); */

app.get("/login", (req, res) => {
  res.render('index');
});

app.use("/api/farmer", farmerRoute); //to use the routes
app.use("/api/supplier", supplierRoute); //to use the routes
app.use("/api/worker", workerRoute); //to use the routes
app.use("/api/product", productRoute); //to use the routes
app.use("/api/productOrder", productOrderRoute); //to use the routes
app.use("/api/job", jobRoute); //to use the routes
app.use("/api/jobOffer", jobOfferRoute); //to use the routes
app.use("/api/issue", issueRoute); //to use the routes

//LISTENER
app.listen(PORT, () => {
  console.log(`Your are listening on port ${PORT}`);
});
