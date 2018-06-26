import jwt from 'jsonwebtoken';
import responseCodes from 'constants/ResponseCodes';

const jwtOptions = {
  expiresIn: '7d',
  issuer: 'mornya.com',
  subject: 'userInfo',
};

export function getToken(jwtPayload, jwtSecret) {
  return new Promise((resolve, reject) => {
    if (jwtPayload && jwtSecret) {
      jwt.sign(jwtPayload, jwtSecret, jwtOptions, (err, token) => {
        // 비동기로 실행하는 콜백 함수임
        if (err) {
          reject({ errorCode: responseCodes.JWT_PUBLISH_FAIL });
        } else {
          resolve(token);
        }
      });
    } else {
      reject({ errorCode: responseCodes.JWT_BAD_PAYLOAD });
    }
  });
}

export function getValidateToken(token, jwtSecret) {
  return new Promise((resolve, reject) => {
    if (token) {
      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          reject({ errorCode: responseCodes.JWT_INVALID });
        } else {
          resolve(decoded);
        }
      });
    } else {
      reject({ errorCode: responseCodes.JWT_NO_VALUE });
    }
  });
}
