const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const graphqlHttp = require('express-graphql');
const db = require('./config/mongo');
const userRoutes = require('./routes/auth');
const graphQlSchema = require('./graphql/schema');
const graphQlResolver = require('./graphql/resolvers');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./config/swagger');
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
app.get('/',(req,res,next)=>{
    res.json('hello');
});
app.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/test',(req,res,next)=>{
    res.sendFile(__dirname + '/index.html');
});
app.use('/auth',userRoutes);
app.use('/graphql', graphqlHttp({
    schema:graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
}) );



module.exports = app;
