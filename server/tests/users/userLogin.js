var mongoose = require('mongoose');
var expect = require('chai').expect;
var app = require('../../../app');
var supertest = require('supertest');

var deleteAfterRun = false;
mongoose.connect('mongodb://localhost/medicalshop-testdb')
var db = mongoose.connection;

const request = supertest(app);

describe('Test user login API endpoint', () => {
    it('should return an error message for an empty email', (done) => {
      request.post('/api/auth/login')
      .send({
        email: '',
        password: '1234567890',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('message').to.equal('Email can not be empty');
        done();
      });
      
    });
   
    it('should return a status 400 error response if email is not correct', (done) => {
      request.post('/api/auth/login')
        .send({
          email: 'hadijahgmailcom',
          password: '1234567890',
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Invalid email format');
          done();
        });
    });
    it('should return an error message for an empty password', (done) => {
      request.post('/api/auth/login')
      .send({
        email: 'hadijah@gmail.com',
        password: '',
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('message').to.equal('Password can not be empty');
        done();
      });
      
    });
    // it('should return a success message for login successful', (done) => {
    //   request.post('/api/auth/login')
    //   .send({
    //     email: 'hadijah@gmail.com',
    //     password: '1234567890',
    //   })
    //   .end((err, res) => {
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.be.an('object');
    //     expect(res.body).to.haveOwnProperty('token');
    //     expect(res.body).to.haveOwnProperty('message').to.equal('logged in successfully');
    //     done();
    //   });
      
    // });
    // it('should return an error message for a wrong password is given', (done) => {
    //     request.post('/api/auth/login')
    //     .send({
    //       email: 'hadijah@gmail.com',
    //       password: '12',
    //     })
    //     .end((err, res) => {
    //       expect(res.status).to.equal(401);
    //       expect(res.body).to.be.an('object');
    //       expect(res.body).to.haveOwnProperty('message').to.equal('Wrong password');
    //       done();
    //     });
        
    //   });
  //     it('should return an error message for un existing email is given', (done) => {
  //       request.post('/api/auth/login')
  //       .send({
  //         email: 'zysh@gmail.com',
  //         password: '122345',
  //       })
  //       .end((err, res) => {
  //         expect(res.status).to.equal(404);
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.haveOwnProperty('message').to.equal('Users Not Found! Please Sign Up');
  //         done();
  //       });
        
  //     });
   
  });
//run once after all tests
after(function (done) {
  if (deleteAfterRun) {
      console.log('Deleting test database');
      mongoose.connection.db.dropDatabase(done);
  } else {
      console.log('Not deleting test database because it already existed before run');
      done();
  }
});