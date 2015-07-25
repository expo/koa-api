'use strict';

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

  // endpointRouter.all('/api/:method/:jsonArgs', api.callMethod);
  // let endpointRouter = router({ prefix: '/--' });

  var cm = callMethod(apiInstance, opts);
  endpointRouter.all('/:method/:jsonArgs', cm);
  app.use(endpointRouter.routes());
  app.use(endpointRouter.allowedMethods());

  return function* (next) {
    yield next;
  };
};

module.exports.ApiError = ApiError;
//# sourceMappingURL=sourcemaps/index.js.map