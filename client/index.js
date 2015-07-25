var gotPromise = require('got-promise');

// TODO: Make this use fetch?

module.exports = function (baseUrl, opts) {
  baseUrl = baseUrl.replace(/\/*$/, '');
  return function (method, args) {
    return new Promise(function (resolve, reject) {
      var url = baseUrl + '/' + method + '/' + encodeURIComponent(JSON.stringify(args));
      return gotPromise.post(url).then(function (result) {
        try {
          var resultObj = JSON.parse(result.body);
          if (resultObj.err) {
            var err = new Error(resultObj.err);
            err._isApiError = true;
            return reject(err);
          } else {
            return resolve(resultObj.result);
          }
        } catch (e) {
          reject(e);
        }
        resolve(result);
      }, function (err) {
        reject(err);
      });
    });
  };
};
