const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user');
const {transformUser} = require('../helpers/transformation')
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}
// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET || 'secret_this_should_be_longer',
   }, async (req, payload, done) => {
    try {
      // Find the user specified in token
      console.log(payload.sub);
      const user = await User.findById(payload.sub);
  
      // If user doesn't exists, handle it
      if (!user) {
        return done(null, false);
      }
      modifyuser = transformUser(user);
  
      // Otherwise, return the user
      req.user = modifyuser;
      done(null, modifyuser);
    } catch(error) {
      done(error, false);
    }
  }));


passport.use(
    new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:'/auth/google',
        passReqToCallback: true,
    }, async (req,accessToken, refreshToken, profile, cb)=>{
        console.log('req',req);
        console.log('req',accessToken);
        if(!profile)
        {
          return res.status(401).json('Authorization Fail');
        }
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        // const user = {
        //     oAuthProvider:'Google',
        //     oAuthId:profile.id,
        //     givenName:profile.name.givenName,
        //     familyName: profile.name.familyName,
        //     email: profile.emails[0].value,
        //     picture:profile.photos[0].value,
        // };
        const user = new User({
            oAuthProvider:'Google',
            oAuthId:profile.id,
            givenName:profile.name.givenName,
            familyName: profile.name.familyName,
            email: profile.emails[0].value,
            picture:profile.photos[0].value,
        });
        try{
            // const result = await User.findOneAndUpdate({oAuthId:profile.id},user,options);
            let result;
            const existingUser = await User.findOne({email:profile.emails[0].value, oAuthProvider:'Google'});
            if(existingUser)
            {
                 result = existingUser;
            }else{
                result = await user.save(); 
            }
            cb(null,result);
        } catch (e) {
            cb(e);
        }
    }),

);


const jwtAuth = passport.authenticate('jwt',{session:false, failWithError: true});
const googleAuth = passport.authenticate('google',{session:false, failWithError: true});
module.exports = {passport,jwtAuth,googleAuth};
