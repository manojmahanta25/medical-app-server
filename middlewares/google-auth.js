
module.exports = async (req, res, next) => {
    try{
    const token = req.body.token;
    console.log(token);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: '169370763175-lnlenv292ps86566tdoi6qjdf6r0381h.apps.googleusercontent.com'
    });
    
    console('userde',ticket.payload);
    req.payload = ticket.payload;
    next();
    }
    catch{
        return res.status(401).json({error:{
            name: 'UnAuthorize',
            message: 'Invalid token',
            text: 'UnAuthorize: Invalid token'
        }})
    }  
};