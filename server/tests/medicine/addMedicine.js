var mongoose = require('mongoose');
var expect = require('chai').expect;
var supertest = require('supertest');
var { app, db } = require('../../../app');

const request = supertest(app)
const adminCredentials = {
    username: 'admin',
    password: 'admin2020',
    question: 'Online Medical Shopping',
}
let adminToken = '';

describe('Test the add medicine endpoint', () =>{
    before(function (done) {
        request.post('/api/auth/admin')
               .send(adminCredentials)
               .end(function (err, response) {
                    adminToken = response.body.token   
                    });
                done();
                });

    it('Returns success message when medicine is added successfully', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "sample",
            "uses": "sample use",
            "dosage": "1*1",
            "sideeffects": "none",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(201)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine successfully added');
        });
    });

    it('Returns error message when medicine is added with no name', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "",
            "description": "sample",
            "uses": "sample use",
            "dosage": "1*1",
            "sideeffects": "none",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine name cannot be empty');
        });
        done();
    });

    it('Returns error message when medicine is added with no description', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "",
            "uses": "sample use",
            "dosage": "1*1",
            "sideeffects": "none",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine description cannot be empty');
        });
        done();
    });

    it('Returns error message when medicine is added with no uses', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "sample",
            "uses": "",
            "dosage": "1*1",
            "sideeffects": "none",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine uses cannot be empty');
        });
        done();
    });

    it('Returns error message when medicine is added with no dosage', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "sample",
            "uses": "sample use",
            "dosage": "",
            "sideeffects": "none",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine dosage cannot be empty');
        });
        done();
    });

    it('Returns error message when medicine is added with no side effects', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "sample",
            "uses": "sample use",
            "dosage": "1*1",
            "sideeffects": "",
            "precautions": "Sample"
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine side effects cannot be empty');
        });
        done();
    });

    it('Returns error message when medicine is added with no precautions', (done) =>{
        request.post('/api/medicines')
        .set('x-access-token', adminToken)
        .send({
            "name": "sample",
            "description": "sample",
            "uses": "sample use",
            "dosage": "1*1",
            "sideeffects": "none",
            "precautions": ""
        })
        .end((err, res)=>{
            expect(res.status).to.equal(400)
            expect(res.body).to.be.an("object");
            expect(res.body).to.haveOwnProperty('message').to.equal('Medicine precautions cannot be empty');
        });
        done();
    });

    //run once after all tests
    after(function (done) {
        db.dropDatabase();
        console.log('Deleting test database');
        done();
    });

});
