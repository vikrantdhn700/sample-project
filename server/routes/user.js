const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/authMiddleware');

router.get("/me", isLoggedIn, async (req, res) => {
    try {
        if(!req.user) return res.status(404).send({"status" : "failed", "message": "Wrong user","result" : ""}); 
        const result = await userModel.findOne({_id : req.user._id}).select('first_name last_name email phone').exec();
        if(result){
            return res.status(200).send({"status" : "success", "message": "Successfully", "result" : result });
        } else {
            return res.status(404).send({"status" : "failed", "message": "Invalid user","result" : ""});
        }        
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }    
});

module.exports = router;

