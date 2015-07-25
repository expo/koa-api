let _ = require('lodash-node');
let router = require('koa-router');

let ApiError = require('./ApiError');
let callMethod = require('./callMethod');

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

  let endpointRouter = router(opts);

  let cm = callMethod(apiInstance, opts);
  endpointRouter.all('/:method/:jsonArgs', cm);
  app.use(endpointRouter.routes());
  app.use(endpointRouter.allowedMethods());

  return function* (next) {
    yield next;
  };

};

module.exports.ApiError = ApiError;
