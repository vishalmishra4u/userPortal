/* global module */

/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(message);
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)'
 * );
 * ```
 */
module.exports = function(message) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req,
    res = this.res,
    sails = req._sails,
    defaultMessage = 'Invalid Request',
    statusCode = 400,
    envelope = {
      status: 'error',
      error: {
        errorCode: statusCode
      }
    };

  // Set status code
  res.status(statusCode);

  // Log error to console
  if (message !== undefined) {
    // add message to the envelope
    envelope.error['message'] = message;
    // log to the console
    sails.log.error('@badRequest - Client Error - ', message);
  } else {
    // add message to the envelope
    envelope.error['message'] = defaultMessage;
    sails.log.error('@badRequest - Client Error - No Message');
  }
  return res.json(envelope);

};
