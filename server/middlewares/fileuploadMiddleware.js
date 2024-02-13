const express = require('express');
const path = require('path');
//const fs = require('fs');
const multer = require('multer');

// const currDate = new Date();
// const currmonth = currDate.getMonth();
// const curryear = currDate.getFullYear(); 
let uploadDirPath = `./public/uploads/`; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {        
        try {
            // if (!fs.existsSync(uploadDirPath)) {
            //    fs.mkdirSync(uploadDirPath);
            // }
            cb(null, uploadDirPath)
        } catch (err) {
            cb(err, uploadDirPath)
        }        
    },
    filename: function (req, file, cb) {        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname;
        cb(null, uniqueSuffix)
    }
});
const uploadFile = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb){
        const fileSize = parseInt(req.headers['content-length']);
        const match = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
        if (match.indexOf(file.mimetype) === -1){
            const error = 'Invalid file type';
            error.code = 'INVALID_FILE_TYPE';
            cb(error,false);        
        } else if (fileSize > 1024 * 1024 * 2) {
            const error = 'File size must be less than 2 MB';
            cb(error, false);
        } else {
            cb(null, true);
        }        
    },
    limits: {
        fileSize: 1024 * 1024 * 2   // 2 mb
    }
});

const multerErrorHandling = (err, req, res, next) => {
    if(!err) next();
    console.log("FIrst "+ multer.MulterError);
    console.log("SCND "+ err);
    if (err instanceof multer.MulterError) {
      return res.status(400).send({"status" : "failed", "message": err,"result" : "1st"});
    } else if (err) {
        console.log("THRD "+ err);
      return res.status(400).send({"status" : "failed", "message": err,"result" : "2nd"});
    } else {
      next();
    }
};


module.exports = { uploadFile, multerErrorHandling };