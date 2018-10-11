var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotEnv = require('dotenv');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');
var VerifyToken = require('./server/models/user/verifyToken');
var VerifyAdminToken = require('./server/models/user/verifyAdminToken')

dotEnv.config();

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

User = require('./server/models/user/user')
Medicine = require('./server/models/medicine/medicine')

const validateSignup = require('./server/middleware/validateSignup')
const validateLogin = require('./server/middleware/validateLogin')
const validateAdmin = require('./server/middleware/validateAdminLogin')


const  env = process.env.NODE_ENV;
// connect to mongoose
if(env === 'test') {
  mongoose.connect('mongodb://localhost/medicalshop-testdb')
} else {
  mongoose.connect('mongodb://localhost/medicalshop')
}

// database object
var db = mongoose.connection;

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
      console.log(req.body)
      return res.status(401).send({
        statusCode: 401,
        message: 'Unauthorized',
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

//Get medicine by id
app.get('/api/medicines/:_id', VerifyToken, function(req, res, next){
  Medicine.getMedicineById(req.params._id,function(err, medicine){
    if(err){
      throw err;
    }
    res.status(200).json(medicine)
  });
});


app.listen('3000');
console.log('Running on port 3000...');
module.exports = {app, db};