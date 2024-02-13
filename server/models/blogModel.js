const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema({
    blog_title : {
        type: String,
        trim : true,
        required: [true, "Title required!"]
    },
    blog_content : {
        type: String,
        trim: true,
        required: [true, "Content required!"]
    },
    blog_files : {
        type: Array,
        trim: true,
        //required: [true, "Content required!"]
    },
    blog_slug : {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },
    blog_author : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true});

//
blogSchema.pre('save', async function(next) {
    let slug = this.blog_title.substring(0, 150);    
    slug = slugify(slug, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    });
    let newslug = await isExistSlug(slug);
    this.blog_slug = newslug;
    next();
});

async function isExistSlug(slug) {
    let isExist = await blogModel.findOne({blog_slug:slug}, '_id').exec();
    if(isExist) {
        slug =  `${slug}-1`;
        return isExistSlug(slug);
    }  else {
        return slug;
    } 
}

const blogModel = new mongoose.model("Blog", blogSchema);
module.exports = blogModel;





  