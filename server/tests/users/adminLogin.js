var mongoose = require('mongoose');
var expect = require('chai').expect;
var {app} = require('../../../app');
var supertest = require('supertest');

const request = supertest(app);

describe('Test admin login API endpoint', () => {
    
    it('should login the admin and return a success message', (done) => {
      request.post('/api/auth/admin')
      .send({
        username: 'admin',
        password: 'admin2020',
        question: 'Online Medical Shopping'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('message').to.equal('Admin logged in successfully');
        done();
      });
      
    });

    it('should return an error message for an empty username', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: '',
          password: 'admin2020',
          question: 'Online Medical Shopping'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Username can not be empty');
          done();
        });
        
      });
   
    it('should return an error message for an empty question', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: 'admin2020',
          password: 'admin',
          question: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Question can not be empty');
          done();
        });
        
      });

      it('should return an error message for an empty password', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: 'admin',
          password: '',
          question: 'Online Medical Shopping'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Password can not be empty');
          done();
        });
        
      });

      it('should return an error message for a wrong question', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: 'admin',
          password: 'admin2020',
          question: 'I am Phiona and me'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Unauthorized');
          done();
        });
        
      });

      it('should return an error message for a wrong password', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: 'admin',
          password: 'admin1',
          question: 'Online Medical Shopping'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Unauthorized');
          done();
        });
        
      });

      it('should return an error message for a wrong username', (done) => {
        request.post('/api/auth/admin')
        .send({
          username: 'admin1',
          password: 'admin2020',
          question: 'Online Medical Shopping'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message').to.equal('Unauthorized');
          done();
        });
        
      }); 
  });
// //run once after all tests
// after(function (done) {
//   if (deleteAfterRun) {
//       console.log('Deleting test database');
//       mongoose.connection.db.dropDatabase(done);
//   } else {
//       console.log('Not deleting test database because it already existed before run');
//       done();
//   }
// });