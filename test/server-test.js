const assert = require('chai').assert
const app = require('../server')
const request = require('request')

describe('Server', function(){

  before(function(done){
    this.port = 9876;
    this.server = app.listen(this.port, function(error, result){
      if (error) { return done(error); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876'
    });
  });

  after(function(){
    this.server.close();
  });

  it('should exist', function(){
    assert(app);
  });

  describe('GET /', function(){
    it('should return a 200', function(done){
      this.request.get('/', function(error, response) {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /api/secrets/:id', function() {
    beforeEach(function(){
      app.locals.secrets = {
        wowowow: 'I am a banana'
      }
    });

    it('should return a 404 if the resource is not found', function(done){
      this.request.get('/api/secrets/bahaha', function(error, response){
        if (error) { return done(error) }
        assert.equal(response.statusCode, 404);
        done();
      });
    });

    it('should return a 200 if the resource is found', function(done){
      this.request.get('/api/secrets/wowowow', function(error, response){
        if (error) { return done(error) }
        assert.equal(response.statusCode, 200);

        assert(response.body.includes('wowowow'), 'ID was not included.')
        done();
      });
    });

    it('should have the id and message from the resource', function(done){
      var id = 'wowowow'
      var message = app.locals.secrets['wowowow'];

      this.request.get('/api/secrets/wowowow', function(error, response){
        if (error) { done(error); }
        assert(response.body.includes(id),
          `"${response.body}" does not include "${id}".`);
        assert(response.body.includes(message),
          `"${response.body}" does not include "${message}".`)
          done();
      });
    });

    describe('POST /api/secrets', function(){
      beforeEach(function(){
        app.locals.secrets = {}
      });
    });

      it('should not return 404', function(done){
        this.request.post('/api/secrets', function(error, response){
          if (error) { done(error) }
          assert.notEqual(response.statusCode, 404)
          done();
        });
      });

      it('should receive and store data', function(done){
        const message = {
          message: 'I like pineapples!'
        };

        this.request.post('/api/secrets', { form: message }, function(error, response){
          if (error) { done(error); }

          const secretCount = Object.keys(app.locals.secrets).length;

          assert.equal(secretCount, 2, `Expected 1 secret, found ${secretCount}`);
          done();
        });
      });
    });
});
