
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions= {
    swaggerDefinition: {
        swagger: "2.0",
         info:{
             title:"Customer API",
             version: '1.0.0',
             description: "Customer API Information",
             contact:{
                 name: "Test Developer"
             }
         },
         host: process.env.APP_HOST,
         tags:[
            {
                name: 'Auth',
                description:"Api for Authentication"
            }
        ],
        schemes:[
            "http",
            "https"
        ],
         definitions:{
            user: {
                type: "object",
                properties:{
                    _id:{
                        type:"ObjectId"
                    },
                oAuthProvider:{
                    type: "String",
                    required: true
                  },
                  oAuthId:{
                      type: "Number",
                      required: false
                  },
                  givenName:{
                      type: "String",
                      required: true
                  },
                  familyName:{
                      type: "String",
                      required: true
                  },
                  email: {
                      type: "String",
                      required: true
                  },
                  phone:{
                      type: "Number",
                      required: false
                  },
                  gender:{
                      type: "String",
                      required: false
                  },
                  picture:{
                      type: "String",
                      required: false
                  },
                  password: {
                      type: "String",
                      required: false
                  },
                  lastIp:{
                      type: "String",
                      required: false
                  } 
                }
            }
         },
         securityDefinitions: {
            // api_key:{
            //     type: "apiKey",
            //     name: "access_token",
            //     in: "cookie"
            // },
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header' 
            },
        },        
     },
     apis: ['./routes/*.js']
 };
 module.exports = swaggerJsDoc(swaggerOptions);