const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const db = require('./config/mongo');
const userRoutes = require('./routes/auth');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./config/swagger');
const io = require('socket.io-client'); 
const helmet = require("helmet");
const googleauth = require('./middlewares/google-auth')
app.use(helmet());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use('/images', express.static(path.join('static/images')));
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS');
    if (req.method === 'OPTIONS'){
        res.setHeader('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.post('/testing',googleauth,(req,res,next)=>{
    res.json({message:'success', user: req.payload})
});
app.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/test',(req,res,next)=>{
    res.sendFile(__dirname + '/index.html');
});
app.use('/auth',userRoutes);
app.get('/',(req,res,next)=>{
    res.json('hello');
});


module.exports = app;
