const jwt = require('jsonwebtoken');
const User = require('./../models/user');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        User.findById(decodedToken.sub).then(result=>{
            req.user=result;
            next();
        }).catch(er=>{
            throw new Error(er);
        });
    } catch (error) {
        res.status(401).json({message:error.message});
         
        
    }
};
