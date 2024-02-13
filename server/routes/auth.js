const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/authMiddleware');

router.post('/register', async (req, res) => {
    try {
        const {first_name, last_name, email, password, phone} = req.body;
        const createUser = new userModel({
                        first_name, last_name, email, password, phone
                    });
        const result = await createUser.save();
        delete result.password;
        return res.status(200).send({"status" : "success", "message": "Successfully register", "result" : result });
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }    
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        //console.log(req.cookies)
        if(!email || !password) {
            return res.status(404).send({"status" : "failed", "message": "Invalid email password", "result" : ""});
        }
        const result = await userModel.findOne({email}).select('-createdAt -updatedAt').lean();
        if(result){
           const isPassMatch = bcrypt.compareSync(password, result.password); 
           if(!isPassMatch) {
              return res.status(404).send({"status" : "failed", "message": "Invalid email password", "result" : ""});
           }
           const fullName = result.first_name + " " +result.last_name;
           let token = jwt.sign({ '_id' : result._id, 'email' : result.email, 'name' :  fullName}, process.env.PRIVATE_KEY, { expiresIn: '10h' });
           result.token = token;
           delete result.password;

           return res.cookie("access_token", token, {
            httpOnly: true,
            secure: "production",
          }).status(200).send({"status" : "success", "message": "Successfully loggedin", "result" : result});
        }
        return res.status(404).send({"status" : "failed", "message": "Invalid email password", "result" : ""});        
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message, "result" : ""});
    }    
});

module.exports = router;

