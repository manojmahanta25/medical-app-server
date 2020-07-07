const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema =new Schema({
    oAuthProvider:{
      type: String,
      required: true
    },
    oAuthId:{
        type: Number,
        required: false
    },
    givenName:{
        type: String,
        required: true
    },
    familyName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: false
    },
    gender:{
        type: String,
        required: false
    },
    picture:{
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    lastIp:{
        type: String,
        required: false
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
