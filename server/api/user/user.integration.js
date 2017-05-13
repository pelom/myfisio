'use strict';

/* globals describe, expect, it, before, after, beforeEach, afterEach */

import app from '../..';
import User from './user.model';
import Profile from '../profile/profile.model';
import request from 'supertest';

describe('User API:', function() {
  var user;
  var profile;

  // Clear users before testing
  before(function() {
    return User.remove().then(function() {
      profile = new Profile({
        nome: 'Profile User',
        isAtivo: true
      });
      profile.save();
      user = new User({
        nome: 'User',
        sobrenome: 'User Faker',
        email: 'test@example.com',
        username: 'test@example.com',
        password: 'password',
        profileId: profile._id,
        isAtivo: true
      });

      return user.save();
    });
  });

  // Clear users after testing
  after(function() {
    return User.remove();
  });

  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          username: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body._id.toString().should.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });
});
