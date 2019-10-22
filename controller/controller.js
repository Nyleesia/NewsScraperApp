// Get dependencies
const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

// Get models
const Comment = require("../models/comments.js");
const Article = require("../models/articles.js");

// Route to get all articles
router.get("/", (req, res) => {
    res.redirect("/articles");

});

// Route to scrape new articles
router.get("/scrape", (req, res) => {
  request("http://www.npr.org/sections/news/archive", (error, response, html) => {
    const $ = cheerio.load(html);
    $("div.archivelist > article").each((i, element) => {

    let response = {};
    
    response.title = $(element).children("div.item-info").children("h2.title").html();
    response.description = $(element).children("div.item-info").children("p.teaser").children("a").text();

    let entry = new Article(response);

    entry.save((err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(`Result: ${result}`);
        }
    });
    });

    // Redirect to home to see all scraped articles
    res.redirect("/");
});  
});

// Route to save an article
router.post("/save/:id", (req, res) => {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
    .exec((err, result) => {
      if (err) {
          console.log(err);
      }
      else {
          console.log(`Result: ${result}`);
      }
    });
});

  // Create a new comment update a comment
  router.post("/comment/:id", (req, res) => {
    let newComment = new Comment(req.body);
    newComment.save((error, newComment) => {
      if (error) {
        console.log(error);
      }
      else {
        Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
        .exec((err, result) => {
          if (err) {
            console.log(err);
          }
          else {
            console.log(`Result: ${result}`);
            res.send(result);
          }
        });
      }
    });
  });

//Get saved articles and associated comments
router.get("/articles/:id", (req, res) => {
    Article.findOne({ "_id": req.params.id })
    .populate("comments")
    .exec((error, response) => {
      if (error) {
        console.log(error);
      }
      else {
        res.json(response);
      }
    });
});

// Unsave a saved article
router.post("/unsave/:id", (req, res)  => {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
    .exec((err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log("Article Removed");
      }
    });
    res.redirect("/saved");
  });
  
//   Export routes
  module.exports = router;