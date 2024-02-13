const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required : [true, "Firstname is required"],
        trim: true
    },
    last_name : {
        type: String,
        required : [true, "Lastname is required"],
        trim: true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v,cb) {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
                if(!emailRegex) return emailRegex;
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    phone : {
        type : Number,
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required : [true, "Phone is required"],
        trim : true
    },
    isloggedin : {
        type: Boolean,
        default: 0
    }
},{timestamps : true});


userSchema.pre('save', async function(next) {
    var self = this;
    let isExist = await userModel.findOne({email: self.email}, '_id').exec();
    if(isExist) {
       next(new Error("User exists!"));
    } 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(self.password, salt);
    this.password = hash;
    next();
});

const userModel = new mongoose.model('User',userSchema);
module.exports = userModel;