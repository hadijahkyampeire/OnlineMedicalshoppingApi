var expect = require('chai').expect;
var app = require('../../../app');
var supertest = require('supertest');

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
  // it('should return a success message when an account is created', (done) => {
  //   request.post('/api/auth/signup')
  //   .send({
  //     email: 'hadijah2@gmail.com',
  //     username:'haddy2',
  //     password: '1234567890',
  //     passwordConf:'1234567890'
  //   })
  //   .end((err, res) => {
  //     expect(res.body).to.be.an('object');
  //     expect(res.body).to.haveOwnProperty('message').to.equal('User created successfully');
  //     done();
  //   });
    
  // });
  it('should return an error message for an empty username', (done) => {
    request.post('/api/auth/signup')
    .send({
      email: 'hadijah@gmail.com',
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