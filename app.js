var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to mongoose
mongoose.connect('mongodb://localhost/medicalshop')
// database object
var db = mongoose.connection;

//first route
app.get('/', function(req, res){
    res.send('Congratulations, Please use the /api/... endpoints');
});

app.listen('3000');
console.log('Running on port 3000...');