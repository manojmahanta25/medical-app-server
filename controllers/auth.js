const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
signToken = user => {
    return jwt.sign({
      iss: process.env.APP_NAME,
      sub: user.id,
      iat: new Date().getTime(), // current time
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, process.env.JWT_SECRET);
  }
module.exports ={
    signup: async (req,res,next)=>{
        
        try{
            const {email,password,firstname,lastname,gender} = req.value.body;
            const existingUser = await User.findOne({email:email});
            if(existingUser){
            throw new Error('Email Already Exist');
            }
            const pass = await bcrypt.hash(password,12);
            const user = new User( {
                oAuthProvider:'local',
                givenName:firstname,
                familyName: lastname,
                email: email,
                gender:gender,
                password: pass
            });
            const result = await user.save();
            const token = signToken(result);
            res.cookie('access_token', token, {
                httpOnly: true
              });
            return res.status(201).json({
                message: 'Auth successful',
                expireIn: 24*60*60
            });
         }
         catch(e){
            return res.status(401).json({ error: e.message});
         }
    },
    signin: async (req,res,next) =>{
        try{
            const {email,password} = req.value.body;
           
            const existingUser = await User.findOne({email:email, oAuthProvider:'local'});
            if(!existingUser){
                throw new Error('Invalid credintials');
                }           
            const isEqual = await bcrypt.compare(password, existingUser.password);
            if(!isEqual){
                throw new Error('Invalid password');
            }
            const token = signToken(existingUser);
            res.cookie('access_token', token, {
                httpOnly: true
              });
            return res.status(200).json({
                message: 'Auth successful',
                expireIn: 24*60*60
            });

        }catch(e){
            return res.status(401).json({error: e.message});
        }
    },
    googleOAuth: async (req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.cookie('access_token', token, {
            httpOnly: true
          });
        return res.status(200).json({
            message: 'Auth successful',
            expireIn: 24*60*60
        });
      },
    signOut: async (req, res, next) => {
       res.clearCookie('access_token');
       res.json({ success: true, message: 'SignOut' });
    },
}