import BaseController from 'controllers/BaseController';
import { getValidateToken } from 'utils/JWT';

export default class UserController extends BaseController {
  constructor(router, { User }) {
    super();

    this.router = router;
    this.router.get('/users', /*this.authorize('ADMIN'),*/ this.getUsers);
    this.router.get('/userRoles', this.getUserRoles);
    this.router.get('/user/:userId/:provider', this.authorize('NONE'), this.getUser);
    this.router.post('/user/:userId', this.authorize('ADMIN'), this.postUser);
    this.router.delete('/user/:userId', this.authorize('ADMIN'), this.deleteUser);
    this.router.get('/user/validateToken', this.authorize('ADMIN'), this.validateToken);

    this.userModel = User;
  }

  getUsers = (req, res) => {
    this.userModel.find({},
      {
        _id: 0,
        group: 1,
        role: 1,
        userId: 1,
        provider: 1,
        userName: 1,
        photoUrl: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .then((resultData) => this.sendResponse(res, { users: resultData }))
      .catch((err) => this.sendResponseException(res, err));
  };

  getUserRoles = (req, res) => {
    this.sendResponse(res, { roles: this.userRoles });
  };

  getUser = (req, res) => {
    const userId = req.params.userId;
    const provider = req.params.provider;
    if (userId && provider) {
      this.userModel.findOne({ userId, provider },
        {
          _id: 0,
          group: 1,
          role: 1,
          userName: 1,
          photoUrl: 1,
          email: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .then((resultData) => {
          // 사용자의 privileges 추가
          const userRoleIndex = this.userRoles.findIndex((item) => item === resultData.role);
          const privileges = {
            isNone: userRoleIndex >= 0,
            isReadable: userRoleIndex >= 1,
            isWritable: userRoleIndex >= 2,
            isManager: userRoleIndex >= 3,
            isAdmin: userRoleIndex >= 4,
          };
          this.sendResponse(res, { user: resultData, privileges })
        })
        .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };

  /**
   * 유저 정보 수정 (group, role만 수정 가능, 그 외의 정보는 소셜 로그인시 상시 업데이트 됨)
   *
   * @param req
   * @param res
   */
  postUser = (req, res) => {
    const userId = req.params.userId;

    if (userId) {
      const { provider, group, role } = req.body;

      this.userModel.update({ userId, provider }, { $set: { group, role } })
        .then((resultData) => this.sendResponse(res, resultData))
        .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };

  /**
   * 유저 정보 삭제
   *
   * @param req
   * @param res
   */
  deleteUser = (req, res) => {
    const userId = req.params.userId;
    const provider = req.body.provider;

    if (userId) {
      //this.userModel.remove({ userId, provider })
      //  .then((resultData) => this.sendResponse(res, resultData))
      //  .catch((err) => this.sendResponseException(res, err));
    } else {
      this.sendResponseError(res, this.responseCodes.HTTP_404);
    }
  };

  validateToken = (req, res) => {
    const token = req.headers['x-access-token'] || req.query.token;
    const jwtSecret = req.app.get('jwt-secret');

    getValidateToken(token, jwtSecret)
      .then((decoded) => res.json({ isSuccess: true, payload: { decoded } }))
      .catch((err) => this.sendResponseError(res, err.errorCode));
  };

  // for passport dependency
  serializeUser = (user, done) => done(null, user._id);

  // for passport dependency
  deserializeUser = (id, done) => this.userModel.findById(id, (err, user) => done(err, user));

  /**
   * saveAuthenticate
   * passport를 통한 로그인 후 사용자 등록 및 업데이트
   *
   * @param provider
   * @param accessToken
   * @param refreshToken
   * @param profile
   * @param done
   */
  saveAuthenticate(provider, accessToken, refreshToken, profile, done) {
    const userId = profile.id;
    const userName = profile.displayName;
    const photoUrl = profile.photos[0].value;
    const email = profile.emails[0].value;

    this.userModel.findOne({ userId, provider })
      .then((resultData) => {
        if (!resultData) {
          // Insert a new user
          return this.userModel.create({ userId, provider, userName, photoUrl, email });
        } else {
          // Update a user
          this.userModel.update({ userId }, { $set: { userName, photoUrl, email } });
          return resultData;
        }
      })
      .then((resultData) => done(null, resultData)) // 사용자 정보 전달
      .catch((err) => done(err));
  }
}
