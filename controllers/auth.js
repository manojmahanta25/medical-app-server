const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
            // res.cookie('access_token', token, {
            //     httpOnly: true
            //   });
              return res.status(200).json({
                token: token,
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
            // res.cookie('access_token', token, {
            //     httpOnly: true
            //   });
              return res.status(200).json({
                token: token,
                message: 'Auth successful',
                expireIn: 24*60*60
                });

        }catch(e){
            return res.status(401).json({error: e.message});
        }
    },
    googleOAuth: async (req, res, next) => {
        try{
            const idToken = req.body.access_token;
            if(!idToken || idToken == null || idToken==' '){
                throw new Error('Empty access_token');
            }
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            if( !ticket.payload.iss || !ticket.payload.iss =='accounts.google.com'){
                throw new Error('Invalid token');
            }
            const profile = ticket.payload;
            const user = new User({
                oAuthProvider:'Google',
                oAuthId:profile.sub,
                givenName:profile.given_name,
                familyName: profile.family_name,
                email: profile.email,
                picture:profile.picture,
            });
            let result;
            const existingUser = await User.findOne({email:profile.email.value, oAuthProvider:'Google'});
            if(existingUser)
            {
                 result = existingUser;
            }else{
                result = await user.save(); 
            }
            const token = signToken(result);
            return res.status(200).json({
            token: token,
            message: 'Auth successful',
            expireIn: 24*60*60
            });
            }
            catch(e){
                return res.status(401).json({error:{
                    name: 'UnAuthorize',
                    message: e.message,
                    text: e.toString()
                }})
            }  
      },
    signOut: async (req, res, next) => {
       res.clearCookie('access_token');
       res.json({ success: true, message: 'SignOut' });
    },
}