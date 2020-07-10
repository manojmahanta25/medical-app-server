const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const graphqlHttp = require('express-graphql');
const db = require('./config/mongo');
const userRoutes = require('./routes/auth');
const graphQlSchema = require('./graphql/schema');
const graphQlResolver = require('./graphql/resolvers');
const fs = require('fs');
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
app.use('/static', express.static(path.join('static')));
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
    res.sendFile(__dirname + '/static/index.html');
});
app.get('/api/test', (req, res) => {
    res.json({
      headers: req.headers,
      address: req.connection.remoteAddress
    });
  });
  const name = process.env.APP_NAME;
  app.get('/api/name', (req, res) => {
    res.json({ name });
  });
  app.get('/api/info', (req, res) => {
    fs.readFile(`${__dirname}/version.txt`, 'utf8', (err, version) => {
      res.json({
        version: version || 0,
        dirname: __dirname,
        cwd: process.cwd()
      });
    });
  });
app.use('/api-doc',swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/auth',userRoutes);
app.use('/graphql', graphqlHttp({
    schema:graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
}) );



module.exports = app;
