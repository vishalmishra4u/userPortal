module.exports = function(data) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req,
    res = this.res,
    sails = req._sails,
    defaultData = {
      validationError: [{
        errorCode: 'VALIDATION_ERROR',
        message: 'Invalid data'
      }]
    },
    statusCode = 422,
    envelope = {
      status: 'fail',
      error: defaultData
    };

  // Set status code
  res.status(statusCode);

  // Log error to console
  if (data !== undefined) {
    // add data to the envelope
    envelope.error = data;
    sails.log.verbose('@failed - Request processed successfully but validation error, data sent :: ', data);
  } else {
    // log to the console
    sails.log.verbose('@failed - Request processed successfully but validation error, but no data sent');
  }

  return res.json(envelope);
};
