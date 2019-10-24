// Get dependencies
const express = require("express");
const router = express.Router();
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");
const axios = require("axios");
console.log("controller/index.js => got dependencies.");

// Get models
const DB = require("../models/index.js");
console.log (DB);
console.log("controller/index.js => got models.");


//////////////////Adding and retrieving articles////////////////////

// Route to get all articles
router.get("/", (req, res) => {
    res.redirect("/articles");

});

// Route to scrape new articles
router.get("/scrape", (req, res) => {
  axios.get("https://www.npr.org/sections/world/").then(function(html) {
    let $ = cheerio.load(html.data);
    
    $("article").each(function(i, element)  {

      let result = {};
        
      result.title = $(element).find('.title').text();
      result.teaser = $(element).find('.teaser').text();
      result.link = $(element).find('.title').children("a").attr('href');
      result.img = $(element).find(".imagewrap").children("a").children("img").attr("src"); 

      DB.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    res.redirect("/");

  });
});

//Get articles at articles route
router.get("/articles", (req, res) => {
  DB.Article.find()
    .sort({ _id: -1 })
    .exec((err, doc) => {
      if (err) {
        console.log(err);
      } else {
        let view = { article: doc };
        res.render("index", view);
        console.log(view);
      }
    });
});

router.get("/deleteAll", function(req, res) {
  DB.Article.deleteMany({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log("removed all articles");
    }
  });
  res.redirect("/");

});


//////////////Adding, updating and retrieving comments/////////////////

router.get("/readArticle/:id", function(req, res) {
  let articleId = req.params.id;
  let hbsObj = {
    article: [],
    body: []
  };

  DB.Articles.findOne({ _id: articleId })
    .populate("comment")
    .exec(function(err, doc) {
      if (err) {
        console.log("Error: " + err);
      } else {
        hbsObj.article = doc;
        var link = doc.link;
        request(link, function(error, response, html) {
          var $ = cheerio.load(html);

          $(".l-col__main").each(function(i, element) {
            hbsObj.body = $(this)
              .children(".c-entry-content")
              .children("p")
              .text();

            res.render("article", hbsObj);
            return false;
          });
        });
      }
    });
});
router.post("/comment/:id", function(req, res) {
  var user = req.body.name;
  var content = req.body.comment;
  var articleId = req.params.id;

  var commentObj = {
    name: user,
    body: content
  };

  var newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      DB.Articles.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/readArticle/" + articleId);
        }
      });
    }
  });
});

//   Export routes
  module.exports = router;