const express= require('express');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    try {
        if(!req.headers.authorization) return res.status(401).send({"status" : "failed", "message": "Unauthorized user", "result" : ""});

        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            let token = req.headers.authorization.split(' ')[1];
            let decoded = await jwt.verify(token, process.env.PRIVATE_KEY);
            if(decoded) {
                req.user = decoded;
                next();
            } else {
                return res.status(401).send({"status" : "failed", "message": "Token mismatch", "result" : ""}); 
            }
        } else {
            return res.status(401).send({"status" : "failed", "message": "Unauthorized user", "result" : ""});
        }        
    } catch (error) {
        return res.status(401).send({"status" : "failed", "message": error.message, "result" : ""});
    }  
}

const isUserLoggedIn = async (req) => {
    try {
        const token =  req?.cookies?.access_token ? req.cookies.access_token : req;
        if (!token) {
           return false; 
        }
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if(decoded) {
            return true;
        } else {
            return false;
        }      
    } catch {
        return false;
    }
};

module.exports = { isLoggedIn, isUserLoggedIn };