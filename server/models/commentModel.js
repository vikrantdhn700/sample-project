const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment : {
        type: String,
        required: [true, "Comment required!"]
    },
    blog_id : {
        type : mongoose.Schema.Types.ObjectId, ref: 'Blog'
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId, ref: 'User'
    }
},{timestamps: true});

const commentModel = new mongoose.model('Comment', commentSchema);
module.exports = commentModel;
