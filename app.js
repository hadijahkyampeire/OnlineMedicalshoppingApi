var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(express.static(__dirname+'/client'));
app.use(bodyParser.json());

User = require('./models/user/user')
const validateSignup = require('./middleware/validateSignup')

// connect to mongoose
mongoose.connect('mongodb://localhost/medicalshop')
// database object
var db = mongoose.connection;



//first route
app.get('/', function(req, res){
    res.send('Congratulations, Please use the /api/... endpoints');
});
;

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
        .exec(function (err, foundUser) {
          if (foundUser) {
            var err = {
                message: 'User already exists.',
                statusCode: 409,
                error: true
            };
            return res.status(409).send(err);
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
app.listen('3000');
console.log('Running on port 3000...');
module.exports = app;