let _ = require('lodash-node');

let ApiError = require('./ApiError');

// var Api = {
//   send: require('./send'),
//   adduser: require('./adduser'),
//   recordEmail: require('./recordEmail'),
//   publish: require('./publish'),
//   whoami: require('./whoami'),
//   shortenUrl: require('./shortenUrl'),
//   logout: require('./logout'),
//   __reverse__: {
//     doc: "Reverses the first argument; for testing the API",
//     methodAsync: async function (env, args) {
//       return args.map((s) => { return s.split("").reverse().join(""); }).reverse();
//     },
//   },
// };

module.exports = function (instance, opts) {

  opts = _.assign({
    logger: console,
    augmentEnvAsync: async function (this_) {
      return {
        koaEnv: this_,
        ip: this_.ip,
        browserId: this_.browserId,
        sessionId: this_.sessionId,
        request: this_.request,
      };
    },
  }, opts);

  let callMethod = function*(next) {
    let method = instance[this.params.method];
    let jsonArgs = this.params.jsonArgs;
    var args;
    if ((!jsonArgs) || (jsonArgs == 'help') || (jsonArgs == 'doc')) {
      this.body = {help: method.doc || "[No documentation available]"};
    } else {
      let argsOk = true;
      try {
        args = JSON.parse(jsonArgs);
      } catch (e) {
        argsOk = false;
        this.body = {err: "Problem with JSON arguments Error: " + e}
        yield next;
        return;
      }

      if (argsOk) {
        let methodName = this.params.method;

        let env = _.assign({
          args,
          method,
          methodName,
        }, yield opts.augmentEnvAsync(this));

        try {
          let result = yield method.methodAsync(env, args);
          if (!_.isObject(result)) {
            result = {result: result};
          }
          result.err = result.err || null;
          this.body = result;
        } catch (e) {
          console.log("caught");
          if (ApiError.isApiError(e)) {
            logger.error("API Error:", e);
            this.body = {err: '' + e.message + '.', _isApiError: true, code: (e.code || 'UNKNOWN_API_ERROR'),};
          } else {
            logger.error("Server Error:", e, e.stack);
            this.body = {err: '' + e.message + '.', _isApiError: false, code: 'SERVER_ERROR',};
          }
        }
      }
    }

    yield next;

  };

  return callMethod;

}
