var mongoose = require('mongoose');
var expect = require('chai').expect;
// var app = require('../../../app');
var supertest = require('supertest');
var { app, db } = require('../../../app');

// mongoose.connect('mongodb://localhost/medicalshop-testdb')
var db = mongoose.connection;
const request = supertest(app);

const userCredentials = {
    email: 'kyamp@gmail.com',
    password: '1234567890',
}

const orderCredentials = {
    medicineName: "panadol",
    quantity: "1",
    userEmail: "kyamp@gmail.com",
    userId: "5bbf0d4156d5360a2ada452b"
}

let token ='';

describe('Order Routes', ()=>{
    var authenticatedUser = request;
    before(function (done) {
        authenticatedUser
            .post('/api/auth/login')
            .send(userCredentials)
            .end(function (err, response) {
                expect(response.statusCode).to.equal(200);
                token = response.body.token
                done();
            });
    });


it('should return an error message when an order is sent with no name', (done) => {
        authenticatedUser.post('/api/medicines/order').set('x-access-token', token)
        .send({
            medicineName: "",
            quantity: "1",
            userEmail: "kyamp@gmail.com",
            userId: "5bbf0d4156d5360a2ada452b"
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.equal('Please input medicine name');
          done();
    });
});

it('should return an error message when an order is sent with no quantity', (done) => {
        authenticatedUser.post('/api/medicines/order').set('x-access-token', token)
        .send({
            medicineName: "panadol",
            quantity: "",
            userEmail: "kyamp@gmail.com",
            userId: "5bbf0d4156d5360a2ada452b"
        })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.equal('Please input medicine quantity');
          done();
    });
});
it('should return a success message when an order is sent', (done) => {
        authenticatedUser.post('/api/medicines/order').set('x-access-token', token)
        .send(orderCredentials)
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.status).to.equal(201);
          expect(res.body).to.haveOwnProperty('message').to.equal('Your order has been sent successfully');
          done();
    });
    
});

//run once after all tests
after(function (done) {
    // mongoose.connection.db.dropDatabase(done);
    db.dropDatabase();
    console.log('Deleting test database');
    done();
});

});