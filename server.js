// Get dependencies
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const routes = require("./controller/controller.js");
mongoose.Promise = Promise;

const PORT = process.env.PORT || 3000;

//Setup dependencies
//Morgan
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// Set path to public folder
app.use(express.static(process.cwd() + "/public"));

// Add routes 
app.use("/", routes);

//Handlebars
app.engine ("handlebars", exphbs ({ defaultLayout : "main"}));
app.set("view engine", "handlebars");

//Connect to server
app.listen(PORT, () => {
  console.log(`Connected to server. Listening on PORT: ${PORT}.`);
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true , useUnifiedTopology: true }, );
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to MongoDB.`);
});
