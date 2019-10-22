// Get dependencies
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000;

//Setup dependencies
//Morgan
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//Handlebars
app.engine ("handlebars", exphbs ({ defaultLayout : "main"}));
app.set("view engine", "handlebars");

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper_news";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to Mongoose!");
});

//Connect to server
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});