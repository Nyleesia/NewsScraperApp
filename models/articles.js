//Get dependency
const mongoose = require("mongoose");

// Setup new schema to handle articles
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
const Article = mongoose.model("Article", ArticleSchema);

//Export Article Schema
module.exports = Article;