const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utilities/logger')();
const webpack = require('webpack');
const config = require('../webpack.config.js');
const legislatorsController = require('./controllers/legislatorsController');

let server;
const app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  const compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
}

app.use(express.static(__dirname + '/public'));

app.get('/legislators*', legislatorsController);

app.use(function (req, res) {
  res.render('index.html', function(err, html) {
    res.send(html);
  });
});

module.exports = Server();

function Server() {
  return Object.create({
    start: start
  });
}

function start(port) {
  return new Promise((resolve) => server = app.listen(port, () => {
    logger.info('Server has started on port: ' + port);
    resolve();
  }));
}