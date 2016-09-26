var fs = require('fs');
var http = require('http');
var util = require('util');
var config = require('../../config');

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
var expect = require('chai').expect;
var request = require('supertest')
var validator = require('validator');

var app = require('../../app');
var www = require('../../bin/www-test');

var mongoose = require('../../config/db.js').mongoose;
var systemDefaults = require('../../models/systemDefaults');
var sysDefault = mongoose.model('SystemDefaults', systemDefaults);
var book = require('../../models/book');
var Book = mongoose.model('Book', book);
var User = mongoose.model('User', require('../../models/user'));

var seed = require('../../db/seedDb');
var clear = require('../../db/clearDb');

/*js to test*/

//setup
chai.use(chaiHttp);

describe('#Home Route', function() {
    beforeEach(function() {
        clear.go();
        seed.go();
    });

    it('should respond to GET', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                done(err);
            });
    });

    it('should respond to POST with bad request', function(done) {
        chai.request(app)
            .post('/')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
    });
});