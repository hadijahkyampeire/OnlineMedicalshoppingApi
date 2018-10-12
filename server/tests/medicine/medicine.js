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

let token = '';

describe('Test Medicnes route', () => {
    //     create a user so as to obtain a token for authentication
    // now let's login the user before we run any tests
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

     //run once after all tests
     after(function (done) {
        // mongoose.connection.db.dropDatabase(done);
        db.dropDatabase();
        console.log('Deleting test database');
        done();
    });

    it("Should return 200 with a medicine array", done => {
        authenticatedUser.get('/api/medicines').set('x-access-token', token).end((err, res) => {
            expect(res.body).to.be.an("array");
            expect(res.status).to.be.equal(200);
        });
        done();
    });

    it("Should return 200 with pagination medicine array", done => {
        authenticatedUser.get('/api/medicines/paginate').set('x-access-token', token).end((err, res) => {
            expect(res.body).to.eql({"Medicines": []});
            expect(res.status).to.be.equal(200);
        });
        done();
    });

    it("Should return 200 with one medicine array", done => {
        authenticatedUser.get('/api/medicines/5bba7cebc8496e8cd5ed9925').set('x-access-token', token).end((err, res) => {
            expect(res.body).to.eql({});
            expect(res.status).to.be.equal(200);
        });
        done();
    });

});

