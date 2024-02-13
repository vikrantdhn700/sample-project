const express = require('express');
const fs = require('fs').promises;
const {isLoggedIn} = require('../middlewares/authMiddleware');


const deleteFile = async function(filePath){
    try {
        await fs.unlink(filePath);
        return true;
    } catch (err) {
        return false;
    }
}


module.exports = {
    deleteFile
};
