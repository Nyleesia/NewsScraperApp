//Get dependency
const mongoose = require("mongoose");

// Setup new schema to handle comments
const Schema = mongoose.Schema;
const CommentSchema = new Schema({
  name: {
    type: String,
  },
  body: {
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
const Comment = mongoose.model("Comment", CommentSchema);

//Export Comment Schema
module.exports = Comment;