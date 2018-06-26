import ROLES from 'constants/Roles';
import { getValidateToken } from 'utils/JWT';
import { responseCodes, responseSuccess, responseError } from 'utils/Response';

export default class BaseController {
  constructor() {
    this.responseCodes = responseCodes;
    this.userRoles = ROLES;
  }

  sendResponse = (response, data) => responseSuccess(response, data);

  sendResponseError = (response, errorCode, exceptionInfo) => {
    console.error(`🔴 ${this.responseCodes[errorCode]}(${errorCode})`, exceptionInfo ? `➠ ${exceptionInfo}` : '');
    responseError(response, errorCode, exceptionInfo);
  };

  sendResponseException = (response, exceptionInfo) => {
    console.error(`🔴 ${exceptionInfo}`);
    responseError(response, this.responseCodes.HTTP_500, exceptionInfo);
  };

  authorize = (acceptRole, acceptGroup) => (req, res, next) => {
    const accessToken = req.headers.authorization || req.query.token;
    if (accessToken) {
      getValidateToken(accessToken.replace('Bearer ', ''), req.app.get('jwt-secret'))
        .then((decodedToken) => {
          if (decodedToken.iss !== 'mornya.com' ||
            !this._checkAcceptRole(acceptRole, decodedToken.rol) ||
            !this._checkAcceptGroup(acceptGroup, decodedToken.grp)) {
            // Send 401 Unauthorized error
            this.sendResponseError(res, this.responseCodes.HTTP_401);
          } else {
            next();
          }
        })
        .catch((err) => this.sendResponseError(res, err.errorCode));
    } else {
      this.sendResponseError(res, this.responseCodes.JWT_NO_VALUE);
    }
  };

  _checkAcceptRole = (acceptRole, userRole = '') => {
    if (acceptRole) {
      const limitIndex = this.userRoles.indexOf(acceptRole);
      return this.userRoles.indexOf(userRole) >= limitIndex;
    }
    return true;
  };

  _checkAcceptGroup = (acceptGroup, userGroup = '') => {
    if (acceptGroup) {
      const groups = ['ALL'];
      if (Array.isArray(acceptGroup)) {
        groups.concat(acceptGroup);
      } else {
        groups.push(acceptGroup);
      }
      return groups.indexOf(userGroup) !== -1;
    }
    return true;
  };
}
