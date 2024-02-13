const express = require('express');
const commentModel = require('../models/commentModel');
const {isLoggedIn} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res) => {
    try {
        const {comment, blog_id} = req.body;
        const user_id = req.user._id;
        const createComment = new commentModel({
            comment, blog_id, user_id
        });
        const result = await createComment.save();
        if(result) {
            return res.status(200).send({"status" : "success", "message": "Successfully created", "result" : result});
        } else {
            return res.status(404).send({"status" : "failed", "message": "Not created", "result" : ""});
        }        
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
});

router.get('/:id', async (req, res) => {
    try {
        if(!req.params.id) return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});

        const blog_id = req.params.id;
        const comments = await commentModel.find({blog_id})
                                    .select('-updatedAt')
                                    .populate('user_id','name email')
                                    .exec();
        if(comments) {
            return res.status(200).send({"status" : "success", "message": "Successfully", "result" : comments});
        } else {
            return res.status(404).send({"status" : "failed", "message": "No comments", "result" : ""});
        }        
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
});

module.exports = router;