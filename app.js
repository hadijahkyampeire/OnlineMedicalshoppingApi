var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotEnv = require('dotenv');
var swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var VerifyToken = require('./server/models/user/verifyToken');
var VerifyAdminToken = require('./server/models/user/verifyAdminToken')

dotEnv.config();

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/',
};
// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./app.js','app.js'],// pass all in array 
  };
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

User = require('./server/models/user/user')
Medicine = require('./server/models/medicine/medicine')
Order = require('./server/models/orders/orders')

const validateSignup = require('./server/middleware/validateSignup')
const validateLogin = require('./server/middleware/validateLogin')
const validateAdmin = require('./server/middleware/validateAdminLogin')
const validateMedicineOrder = require('./server/middleware/validateOrder')
const validateMedicine = require('./server/middleware/validateMedicine')


const  env = process.env.NODE_ENV;
// connect to mongoose
if(env === 'test') {
  mongoose.connect('mongodb://localhost/medicalshop-testdb')
} else {
  mongoose.connect('mongodb://localhost/medicineshop')
}

// database object
var db = mongoose.connection;

// serve swagger 
app.get('/swagger.json', function(req, res) {  
  res.setHeader('Content-Type', 'application/json');   res.send(swaggerSpec); });

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     description: Add users
 *     tags:
 *       - Signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: signup
 *         description: Signup credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Signup'
 *     responses:
 *       201:
 *         description: user registration
 *         schema:
 *           $ref: '#/definitions/Signup'
 */
app.post('/api/auth/signup', validateSignup, function(req, res, next){
    // req.body allows us to access everything coming from the forms into the genre object
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {

        var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
        }
    
        User.findOne({ email: userData.email })
        .exec(function (error, foundUser) {
          if (foundUser) {
            return res.status(409).send({
                message: 'Email already taken.',
                statusCode: 409,
                error: true
            });
          } else {
            User.findOne({username: userData.username})
            .exec(function(error, user){
              if(user){
                return res.status(409).send({
                  message: 'Username already taken.',
                  statusCode: 409,
                  error: true
              });
              }else{
                User.create(userData, function (error, newUser) {
                  if (error) {
                      return next(error);
                  } 
                  return res.status(201).json({user: newUser,
                      statusCode:201,
                      message:'User created successfully'})
                  });
              }
            })
                
            }
        });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     description: Login users
 *     tags:
 *       - Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: login
 *         description: login credentials
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       201:
 *         description: user login
 *         schema:
 *           $ref: '#/definitions/Login'
 */
app.post('/api/auth/login', validateLogin,function(req, res) {

    const { email, password } = req.body;
    User.findOne({email: email})
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).send({
            statusCode: 404,
            message: 'Users Not Found! Please Sign Up'
          });
        } else if (bcrypt.compareSync(password, foundUser.password)) {
          return res.status(200).send({
            message: 'logged in successfully',
            token: jwt.sign({
              id: foundUser.id,
              email: foundUser.email,
            }, config.secret, { expiresIn: '24h' })
          });
        }
        return res.status(401).send({
          statusCode: 401,
          message: 'Wrong password',
        });
      }); 
  });

  app.post('/api/auth/admin', validateAdmin, function(req, res) {

    const { question, username, password } = req.body;
    if (question === "Online Medical Shopping" && password === "admin2020" && username === "admin") {
      return res.status(200).send({
        message: 'Admin logged in successfully',
        token: jwt.sign({
          password: password,
          username: username,
        }, config.secret, { expiresIn: '24h' })
      });
    } else {
      return res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
   
  });

//Add medicine
app.post('/api/medicines', VerifyAdminToken, validateMedicine, function(req, res){
  if (req.body.name &&
    req.body.description &&
    req.body.uses &&
    req.body.dosage &&
    req.body.sideeffects &&
    req.body.precautions) {

    var medicineData = {
      name: req.body.name,
      description: req.body.description,
      uses: req.body.uses,
      dosage: req.body.dosage,
      sideeffects: req.body.sideeffects,
      precautions: req.body.precautions
    }
    Medicine.findOne({name: medicineData.name})
            .exec(function(error, name){
              if(name){
                return res.status(409).send({
                  message: 'Medicine already exists.',
                  statusCode: 409,
              });
            }
            else{
              Medicine.addMedicine(medicineData, function(err, medicine){
                if(err){
                  throw err;
                }
                return res.status(201).send({
                  medicine: medicine,
                  statusCode: 201,
                  message: 'Medicine successfully added'
                });
              });
            }
        });
      }
    });
  

//Get all medicines
app.get('/api/medicines', VerifyToken, function(req, res, next){
  Medicine.getMedicines(function(err, medicines){
    if (err){
      throw err;
    }
    res.status(200).json(medicines)

  });
});

//search endpoint
app.get('/api/medicines/search/', VerifyToken, function(req, res, next){
  const params = req.query;
  Medicine.find({name: {$regex: params.q}}, function(err, medicine){
  if(err){
      throw err;
    }
  return res.status(200).json({ Medicine: medicine });
  })
  
});

// Paginate medicine endpoint
app.get('/api/medicines/paginate',VerifyToken, function(req,res){
  var page = parseInt(req.query.page),
      size = parseInt(req.query.size),
      skip = page & 0 ? ((page - 1) * size) : 0;
 
      Medicine.find(null, null, {
         skip: skip,
         limit: size
      }, function (err, data) {
         if(err) {
            res.json(500, err);
         }
         else {
            res.status(200).json({
               Medicines: data
            });
         }
      });
})
//Get medicine by id
app.get('/api/medicines/:_id', VerifyToken, function(req, res, next){
  Medicine.getMedicineById(req.params._id,function(err, medicine){
    if(err){
      throw err;
    }
    res.status(200).json(medicine)
  });
});

//order for medicines
app.post('/api/medicines/order', VerifyToken, validateMedicineOrder, function(req, res, next){
  var userEmail = req.currentUser.email
  var userId = req.currentUser.id
  var medicineOrder = {
    medicineName: req.body.medicineName,
    quantity: req.body.quantity,
    userEmail: userEmail,
    userId: userId,
    }
  Order.addOrder(medicineOrder, function(err, order){
      if(err){
          throw err;
      }
      res.status(201).json({
          orderedMedicine:order,
          status:201,
          success:true,
          message:'Your order has been sent successfully'});
  });
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.listen('3000');
console.log('Running on port 3000...');
module.exports = {app, db};