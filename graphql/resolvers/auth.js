const User = require('../../models/user');
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
   createUser: async args=>{     
     
      try {
         const email= args.userInput.email;
         const firstname=args.userInput.firstname;
         const lastname=args.userInput.lastname;
         const password=args.userInput.password;
         const gender=args.userInput.gender;
         const lastIp = args.userInput.lastIp;
       
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
                gender: gender,
                password: pass
            });
            const result = await user.save();
            const token = signToken(result);
            return {message: 'Auth successful', token: token, expireIn: 24*60*60};
      }catch(e){
         throw e;
      }
   },
   login: async ({email, password}) => {
      try{
      const user = await User.findOne({email:email, oAuthProvider:'local'})
      if(!user){
          throw new Error('Credientials Doesnt match our record');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if(!isEqual){
          throw new Error('Invalid Password');
      }
      const token = signToken(user);
      return {message: 'Auth successful', token: token, expireIn: 24*60*60};
      }catch(e)   {
         throw e;
      }
  },
  google: async({access_token}) => {
   try{
      const idToken = access_token;
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
      return {message: 'Auth successful', token: token, expireIn: 24*60*60};
      }
      catch(e){
         throw e;
      }  

  }
}