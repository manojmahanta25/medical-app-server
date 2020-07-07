exports.handleError=(err,req,res,next)=>{
    let output, statusCode;
    switch(err.name){
        case 'InternalOAuthError':
            output = {
                error:{
                    name: 'Invalid access token',
                    message:'Provide a valid access token',
                    text:'Invalid access token: Provide a valid access token'
                }
            }
            statusCode = 401;
            break;
        default:
            output = {
                error: {
                    name: err.name,
                    message: err.message,
                    text: err.toString()
                }
            };
            statusCode = err.status || 500;
    } 
    return res.status(statusCode).json(output);
}