export default {
  // Succeed
  SUCC: { status: 200, code: 'SUCC', message: 'Succeed request' },
  // HTTP Error
  HTTP_401: { status: 401, code: 'HTTP_401', message: '401 Unauthorized' },
  HTTP_403: { status: 403, code: 'HTTP_403', message: '403 Forbidden' },
  HTTP_404: { status: 404, code: 'HTTP_404', message: '404 Not Found' },
  HTTP_500: { status: 500, code: 'HTTP_500', message: '500 Internal Server Error' },
  // JWT Error
  JWT_PUBLISH_FAIL: { status: 401, code: 'JWT_PUBLISH_FAIL', message: 'Cannot publish access token' },
  JWT_BAD_PAYLOAD: { status: 401, code: 'JWT_BAD_PAYLOAD', message: 'Bad payloads to publish access token' },
  JWT_INVALID: { status: 401, code: 'JWT_INVALID', message: 'Invalid access token' },
  JWT_NO_VALUE: { status: 401, code: 'JWT_NO_VALUE', message: 'No access token' },
  // Multimedia Upload Error
  ASSET_UPLOAD_FAIL: { status: 500, code: 'ASSET_UPLOAD_FAIL', message: 'Failed asset file upload' },
  // Mailer (sendMail) Error
  MAILER_FAIL: { status: 500, code: 'SEND_MAIL_FAIL', message: 'Failed send mail' },
};
