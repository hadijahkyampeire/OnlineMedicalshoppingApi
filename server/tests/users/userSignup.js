var mongoose = require('mongoose');
var expect = require('chai').expect;
var {app} = require('../../../app');
var supertest = require('supertest');

// var deleteAfterRun = true;
// mongoose.connect('mongodb://localhost/medicalshop-testdb')
// var db = mongoose.connection;

const request = supertest(app);

describe('Test user API', () => {
  it('should return an error message for an empty email', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: '',
      username:'haddy',
      password: '1234567890',
      passwordConf:'1234567890'
    })
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('message').to.equal('Email can not be empty');
      done();
    });
    
  });
  it('should return a success message for account created', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'kyamp@gmail.com',
      username:'haddijjah',
      password: '1234567890',
      passwordConf:'1234567890'
    })
    .end((err, res) => {
      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('message').to.equal('User created successfully');
      done();
    });
    
  });
  it('should return an error message when an account email is alreadycreated', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'kyamp@gmail.com',
      username:'haddijah',
      password: '1234567890',
      passwordConf:'1234567890'
    })
    .end((err, res) => {
      expect(res.body).to.be.an('object');
      expect(res.status).to.equal(409);
      expect(res.body).to.haveOwnProperty('message').to.equal('Email already taken.');
      done();
    });
    
  });
  it('should return an error message when an account username is already created', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'kyamp1@gmail.com',
      username:'haddijjah',
      password: '1234567890',
      passwordConf:'1234567890'
    })
    .end((err, res) => {
      expect(res.body).to.be.an('object');
      expect(res.status).to.equal(409);
      expect(res.body).to.haveOwnProperty('message').to.equal('Username already taken.');
      done();
    });
    
  });

  it('should return an error message for an empty username', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'kyamp@gmail.com',
      username:'',
      password: '1234567890',
      passwordConf:'1234567890'
    })
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('message').to.equal('Username can not be empty');
      done();
    });
    
  });
  it('should return a status 400 error response if email is not correct', (done) => {
    request.post('/api/auth/signup')
      .send({
        email: 'hadijahgmailcom',
        username:'haddy',
        password: '1234567890',
        passwordConf:'1234567890'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('message').to.equal('Invalid email format');
        done();
      });
  });
  it('should return an error message for an empty password', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'hadijah@gmail.com',
      username:'haddy',
      password: '',
      passwordConf:''
    })
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('message').to.equal('Password can not be empty');
      done();
    });
    
  });
  it('should return an error message for password mismatch', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'hadijah@gmail.com',
      username:'haddy',
      password: '1234567890',
      passwordConf:'12345tyui'
    })
    .end((err, res) => {
      expect(res.status).to.equal(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.haveOwnProperty('message').to.equal('passwords dont match');
      done();
    });
    
  });
});

//run once after all tests
// after(function (done) {
//   if (deleteAfterRun) {
//       console.log('Deleting test database');
//       mongoose.connection.db.dropDatabase(done);
//   } else {
//       console.log('Not deleting test database because it already existed before run');
//       done();
//   }
// });