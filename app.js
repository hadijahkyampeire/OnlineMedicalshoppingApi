var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./config');

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

User = require('./server/models/user/user')
const validateSignup = require('./server/middleware/validateSignup')
const validateLogin = require('./server/middleware/validateLogin')

// connect to mongoose
mongoose.connect('mongodb://localhost/medicalshop')
// database object
var db = mongoose.connection;



// //first route
// app.get('/', function(req, res){
//     res.send('Congratulations, Please use the /api/... endpoints');
// });
// ;

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
        .exec(function (foundUser) {
          if (foundUser) {
            return res.status(409).send({
                message: 'User already exists.',
                statusCode: 409,
                error: true
            });
          } else {
                User.create(userData, function (error, newUser) {
                    if (error) {
                        return next(error);
                    } 
                    return res.json({user: newUser,
                        statusCode:201,
                        message:'User created successfully'})
                    });
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
app.listen('3000');
console.log('Running on port 3000...');
module.exports = app;