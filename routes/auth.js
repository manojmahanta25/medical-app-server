const express = require("express");
const router = express.Router();
// const {jwtAuth,googleAuth}= require('../config/passport');
const userController = require('../controllers/auth');
const { validateBody, schemas } = require('../helpers/validator');
const {handleError} = require('../helpers/errors');
const jwtAuth = require('../middlewares/JwtAuth');

router.post('/login',validateBody(schemas.loginSchema),userController.signin);
/**
 * @swagger
 * /auth/login:
 *  post:
 *      tags: 
 *          - Auth
 *      summary: "User Login in Local Method"
 *      description: JWT Authentication
 *      consumes: ["application/json"]          
 *      produces: ["application/json"] 
 *      requestBody:
 *      parameters:
 *      -   name: "body"
 *          in: "body"
 *          description: "The user name for login"
 *          required: true
 *          schema:
 *             type: "object"
 *             properties:
 *                email: 
 *                  type: "string"
 *                password:
 *                  type: "string"
 *             example:
 *                 email: "test@test.com"
 *                 password: "password"
 *      responses:
 *          '200':
 *              description: Successful respose
 *          '401':
 *              description: Authentication Fail
 */
// router.get('/google',gmid);
router.post('/google',userController.googleOAuth);
/**
 * @swagger
 * /auth/google:
 *  post:
 *      tags: 
 *          - Auth
 *      summary: "User Login in Google Method by sending idToken in request"
 *      description: Google Authentication
 *      consumes: ["application/json"]          
 *      produces: ["application/json"] 
 *      requestBody:
 *      parameters:
 *      -   name: "body"
 *          in: "body"
 *          description: "The user name for login"
 *          required: true
 *          schema:
 *             type: "object"
 *             properties:
 *                access_token: 
 *                  type: "string"               
 *             example:
 *                 access_token: "sent the idtoken"
 *      responses:
 *          '200':
 *              description: Successful respose
 *          '401':
 *              description: Authentication Fail
 */
router.post('/signup',validateBody(schemas.signSchema),userController.signup);
/**
 * @swagger
 * /auth/signup:
 *  post:
 *      tags: 
 *          - Auth
 *      summary: "User Signup in Local Method"
 *      description: Local Signup
 *      consumes: ["application/json"]          
 *      produces: ["application/json"] 
 *      requestBody:
 *      parameters:
 *      -   name: "body"
 *          in: "body"
 *          description: "The user name for login"
 *          required: true
 *          schema:
 *             type: "object"
 *             properties:
 *                firstname: 
 *                  type: "string" 
 *                  required: true
 *                lastname: 
 *                  type: "string"
 *                  required: true
 *                email: 
 *                  type: "string" 
 *                  required: true
 *                password: 
 *                  type: "string"
 *                  required: true     
 *                phone: 
 *                  type: "string"
 *                gender: 
 *                  type: "string"              
 *             example:
 *                 firstname: "firstname"
 *                 lastname: "lastname"
 *                 email: "test@test.com"
 *                 password: "secret"
 *                 phone: 8765432102
 *                 gender: "Male"
 *      responses:
 *          '201':
 *              description: Successful respose
 *          '401':
 *              description: Authentication Fail
 */
router.get('/logout',userController.signOut);
/**
 * @swagger
 * /auth/logout:
 *  get:
 *      tags: 
 *          - Auth
 *      summary: "Singout from auth"
 *      description: Remove Cookie        
 *      produces: ["application/json"] 
 *      responses:
 *          '200':
 *              description: Successful respose
 *          '401':
 *              description: Authentication Fail
 *    #  security:
 *     # -   bearerAuth: []
 */

router.get('/currentuser',jwtAuth,(req,res,next)=>{ res.json(req.user); },handleError);
/**
 * @swagger
 * /auth/currentuser:
 *  get:
 *      tags: 
 *          - Auth
 *      summary: "Get the current Login User"
 *      description: Curent Login User Details        
 *      produces: ["application/json"] 
 *      responses:
 *          '200':
 *              description: Successful respose
 *          '401':
 *              description: Authentication Fail
 *      security:
 *      -   bearerAuth: []
 */

router.get('/failure',(req,res,next)=>{res.status(401).json('Authorization Fail');});
router.post('/secret',jwtAuth,(req,res,next)=>{
    res.json({text:'we are here',user:req.user});
},handleError);
module.exports = router;
