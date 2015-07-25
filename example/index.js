var _ = require('lodash-node');

var koa = require('koa');
var api = require('koa-api');
var identify = require('koa-identify');
var logger = require('koa-logger');
var router = require('koa-router');

var ExampleApi = {
    add: {
      doc: "Adds two numbers and returns the result",
      methodAsync: function (env, args) {
        console.log("Called methodAsync");
        return new Promise(function (resolve, reject) {
          var sum = 0;
          for (var i = 0; i < args.length; i++) {
            if (!_.isNumber(args[i])) {
              var err = api.ApiError('TYPE_ERROR', args[i] + " is not a number!");
              console.error(err);
              return reject(err);
            } else {
              sum += args[i];
            }
          }
          console.log("Added up", args, "to get", sum);
          return resolve(sum);
        });
      },
   },
};

var app = koa();
app.name = 'example-api';
app.proxy = true;
app.experimental = true;

app.use(logger());
app.use(identify());
app.use(api(app, ExampleApi));

if (require.main === module) {
  var port = 3000;
  var server = app.listen(port, function () {
    var addr = server.address();
    var port = addr.port;
    var host = addr.address;
    console.log('Listening on http://' + host + ':' + port + ' using NODE_ENV=' + process.env.NODE_ENV);
  });
}

module.exports = app;
