'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _ = require('lodash-node');
var router = require('koa-router');

var ApiError = require('./ApiError');
var callMethod = require('./callMethod');

module.exports = function (app, apiInstance, prefix, opts) {

  if (_.isObject(prefix) && !opts) {
    opts = prefix;
  } else if (!prefix) {
    prefix = '';
  }

  if (!opts) {
    opts = {};
  }

  opts.prefix = opts.prefix || prefix;

  var endpointRouter = router(opts);

  var cm = callMethod(apiInstance, opts);
  endpointRouter.all('/:method/:jsonArgs', cm);
  endpointRouter.all('/', function* (next) {
    var docs = {};
    for (var k of _Object$keys(apiInstance)) {
      docs[k] = apiInstance[k].doc || "[No documentation]";
    }
    this.body = JSON.stringify({
      availableMethods: docs
    });
    yield next;
  });
  app.use(endpointRouter.routes());
  app.use(endpointRouter.allowedMethods());

  return function* (next) {
    yield next;
  };
};

module.exports.ApiError = ApiError;
//# sourceMappingURL=sourcemaps/index.js.map