const assert = require('chai').assert
const app = require('../server')
const request = require('request')

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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
    beforeEach((done) => {
      database.raw(
        'INSERT INTO secrets (message, created_at) VALUES (?, ?)',
        ["I open bananas from the wrong side", new Date]
      ).then(() => done());
    })

    afterEach((done) => {
      database.raw('TRUNCATE secrets RESTART IDENTITY')
      .then(() => done());
    })

    it('should return a 404 if the resource is not found', function(done){
      this.request.get('/api/secrets/10000', function(error, response){
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

    // it('should return the id and message from the resource found', (done) => {
    //   this.request.get('/api/secrets/1', (error, response) => {
    //     if (error) { done(error) }
    //
    //     const id = 1
    //     const message = "I open bananas from the wrong side"
    //
    //     let parsedSecret = JSON.parse(response.body)
    //
    //     assert.equal(parsedSecret.id, id)
    //     assert.equal(parsedSecret.message, message)
    //     assert.ok(parsedSecret.created_at)
    //     done();
    //   })
    // })

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
