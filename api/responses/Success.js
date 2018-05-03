/* global module */

/**
 * 200 (Success) Handler
 *
 * Usage:
 * return res.success();
 * return res.success(data);
 * e.g.:
 * ```
 * return res.success({
 *   id: 1,
 *   name: "John"
 * });
 * ```
 */

module.exports = function(data) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req,
    res = this.res,
    sails = req._sails,
    defaultData = 'Ok',
    statusCode = 200,
    envelope = {
      status: 'success',
      data: defaultData
    };

  // Set status code
  res.status(statusCode);

  // Log error to console
  if (data !== undefined) {
    // add data to the envelope
    envelope.data = data;
    // log to the console
    sails.log.verbose('@success - Request processed successfully, data sent :: ', data);
  } else {
    sails.log.verbose('@success - Request processed successfully, but no data sent');
  }
  return res.json(envelope);
};
