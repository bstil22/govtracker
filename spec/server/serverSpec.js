const request = require('supertest');
const server = require('../../server/server');

describe('Server', function () {

  beforeAll(function (done) {
    this.port = 3003;
    server.start(this.port).then(done);
  });

  afterAll(function (done) {
    server.stop().then(done);
  });

  describe('GET /zipCode', function () {
      it('returns a 200', function (done) {
        this.response = request('http://127.0.0.1:' + this.port)
          .get('/zipCode');
        this.response.expect(function (res) {
          expect(res.status).toBe(200)
        }).end(function (err) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
      });
  });

  describe('GET /', function () {
      it('returns a 200', function (done) {
        this.response = request('http://127.0.0.1:' + this.port)
          .get('/');
        this.response.expect(function (res) {
          expect(res.status).toBe(200);
          expect(res.headers['content-type']).toMatch(/text\/html/);
          expect(res.text).toMatch(/<body>/)
        }).end(function (err) {
          if (err) {
            done.fail(err);
          } else {
            done();
          }
        });
      });
  });

});