const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const blogModel = require('../models/blogModel');
const {isLoggedIn} = require('../middlewares/authMiddleware');
const {uploadFile, multerErrorHandling} = require('../middlewares/fileuploadMiddleware');
const {deleteFile} = require('../global/global');
const router = express.Router();

router.post('/', isLoggedIn, uploadFile.single('file'), multerErrorHandling, async (req, res) => {
    try {
        const {blog_title, blog_content} = req.body;
        const blog_author = req.user._id;
        let blog_files = "";
        if(req.file){
            blog_files = req.file;
            blog_files.imgurl = `/uploads/${req.file.filename}`
        }
        const createBlog = new blogModel({
            blog_title, blog_content, blog_author, blog_files
        });
        const result = await createBlog.save();
        return res.status(200).send({"status" : "success", "message": "Successfully created", "result" : result});
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }    
});

router.get('/',isLoggedIn, async (req, res) => {
    const result = await getBlogs(req, res, req.user._id);
    res.return;
});

router.get('/all', async (req, res) => {
    const result = await getBlogs(req, res);
    res.return;
});

router.get('/:id',isLoggedIn, async (req, res) => {
    try {
        if(!req.params.id) return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});

        const _id = req.params.id;
        const blog_author = req.user._id;
        const blogs = await blogModel.findOne({_id , blog_author})
                                    .select('-updatedAt')
                                    .exec();
        if(blogs) {
            return res.status(200).send({"status" : "success", "message": "Successfully", "result" : blogs});
        } else {
            return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
        }
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
    }
});

router.get('/detail/:slug', async (req, res) => {
    try {
        if(!req.params.slug) return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});

        const blog_slug = req.params.slug;
        const blogs = await blogModel.findOne({blog_slug})
                                    .select('-updatedAt')
                                    .exec();
        if(blogs) {
            return res.status(200).send({"status" : "success", "message": "Successfully", "result" : blogs});
        } else {
            return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
        }
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
    }
});

router.patch('/:id', isLoggedIn, uploadFile.single('file'), multerErrorHandling, async(req, res) => {
    try {
        if(!req.params.id) return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});

        const _id = req.params.id;
        const blog_author = req.user._id;
        const blogs = await blogModel.findOne({_id , blog_author})
                                    .select('_id blog_files')
                                    .exec();
        if(!blogs) {
            return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
        } else {
            const {blog_title, blog_content} = req.body;
            const updateSchema = {
                blog_title,
                blog_content
            };
    
            if(req.file){
               let blog_files = req.file;
                blog_files.imgurl = `/uploads/${req.file.filename}`

                if(blogs.blog_files && blogs.blog_files.length > 0){
                    const delPath = blogs.blog_files[0].destination+blogs.blog_files[0].filename;
                    await deleteFile(delPath);               
                }

                updateSchema.blog_files = blog_files
            } 

            const updateBlog = await blogModel.findOneAndUpdate({_id}, updateSchema, {new : true});
            if(updateBlog) {
                return res.status(200).send({"status" : "success", "message": "Successfully updated", "result" : updateBlog}); 
            } else{
                return res.status(404).send({"status" : "failed", "message": "Not updated","result" : ""});
            }           
        }        
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        if(!req.params.id) return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});

        const _id = req.params.id;
        const blog_author = req.user._id;
        const blogs = await blogModel.findOne({_id , blog_author})
                                    .select('_id blog_files')
                                    .exec();
        if(!blogs) {
            return res.status(404).send({"status" : "failed", "message": "Invalid blog","result" : ""});
        } else {
            if(blogs.blog_files && blogs.blog_files.length > 0){
                const delPath = blogs.blog_files[0].destination+blogs.blog_files[0].filename;
                await deleteFile(delPath);                               
            }
            
            const deleteBlog = await blogModel.findOneAndDelete({_id});
            if(deleteBlog) {
                return res.status(200).send({"status" : "success", "message": "Successfully deleted", "result" : deleteBlog}); 
            } else {
                return res.status(404).send({"status" : "failed", "message": "Not deleted","result" : ""});
            }
        }
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
});

router.delete('/deletefile/:id', isLoggedIn, async (req, res) => {
    try {
        if(!req.params.id) return res.status(404).send({"status" : "failed", "message": "Invalid blog 1","result" : ""});

        const _id = req.params.id;
        const blog_author = req.user._id;
        const blogs = await blogModel.findOne({_id , blog_author})
                                    .select('_id blog_files')
                                    .exec();
        if(!blogs) {
            return res.status(404).send({"status" : "failed", "message": "Invalid blog 2","result" : ""});
        } else {
            if(blogs.blog_files && blogs.blog_files.length > 0){
                const delPath = blogs.blog_files[0].destination+blogs.blog_files[0].filename;
                const isDeleted = await deleteFile(delPath);
                if(isDeleted) {
                    const updateBlog = await blogModel.findOneAndUpdate({_id}, {blog_files : ""}, {new : true});
                    if(updateBlog) {
                        return res.status(200).send({"status" : "success", "message": "Successfully removed", "result" : updateBlog}); 
                    } else{
                        return res.status(404).send({"status" : "failed", "message": "Not removed","result" : ""});
                    }
                }  else {
                    return res.status(404).send({"status" : "failed", "message": "Not removed","result" : ""});
                }              
            } else {
                return res.status(404).send({"status" : "failed", "message": "No file exist","result" : ""});
            }            
        }
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
});

async function getBlogs(req, res, user_id = "") {
    try {
        const orderBy = req.query.orderby || '_id';
        const order = parseInt(req.query.order) || -1;
        const limit = parseInt(req.query.limit) || 2;
        const page = parseInt(req.query.page) || 1;

        const sort = { [orderBy]: order };
        const skip = (page - 1) * limit;
        //req.user._id
        let match = {};
        if(user_id){
            match = { blog_author : new mongoose.Types.ObjectId(user_id) };
        }       

        const blogs = await blogModel.aggregate([                                                                                
                        { $match : match },
                        { $sort: sort },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                "blog_title" : {
                                    $cond: { if: { $gt: [  { $strLenCP: "$blog_title" }, 50] }, then: {
                                        $concat: [ {$substr: ["$blog_title", 0, 50]}, "..." ]
                                    }, else: "$blog_title" 
                                }
                                },
                                "blog_content": {
                                    $substr: ["$blog_content", 0, 150]
                                },
                                "blog_files" : 1,
                                "blog_slug" : 1,
                                "blog_author" : 1,
                                "createdAt" : 1
                            }
                        }
                    ]);
        const totalBlogCount = await blogModel.aggregate([
            { 
                $match : match 
            },
            {
                $count: "totalBlog"
            }
        ]);

        let totalBlog = 0;
        if(totalBlogCount && totalBlogCount.length > 0) {
            totalBlog = totalBlogCount[0].totalBlog;
        }

        const results = {
            "page": page,
            "limit" : limit,
            "blogLength": blogs.length,
            "totalLength" : totalBlog,
            "totalPage": Math.ceil(totalBlog/limit),
            "data" : blogs
        };
        return res.status(200).send({"status" : "success", "message": "Successfully", "result" : results});
    } catch (error) {
        return res.status(404).send({"status" : "failed", "message": error.message,"result" : ""});
    }
}

module.exports = router;
