/*
 * 소셜 로그인 설정
 */
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import NaverStrategy from 'passport-naver';
import KakaoStrategy from 'passport-kakao';

export default (controllerMap) => {
  const { env } = process;
  const userController = controllerMap.User;

  passport.serializeUser((user, done) => userController.serializeUser(user, done));
  passport.deserializeUser((id, done) => userController.deserializeUser(id, done));

  // Initialize Facebook Strategy
  passport.use(
    new FacebookStrategy({
      clientID: env.PASSPORT_FACEBOOK_CLIENT_ID,
      clientSecret: env.PASSPORT_FACEBOOK_CLIENT_SECRET,
      callbackURL: env.PASSPORT_FACEBOOK_CALLBACK_URL,
      profileFields: JSON.parse(env.PASSPORT_FACEBOOK_PROFILE_FIELDS),
    }, (accessToken, refreshToken, profile, done) => {
      userController.saveAuthenticate('facebook', accessToken, refreshToken, profile, done);
    })
  );

  // Initialize Google OAuth2 Strategy
  passport.use(
    new GoogleStrategy({
      clientID: env.PASSPORT_GOOGLE_CLIENT_ID,
      clientSecret: env.PASSPORT_GOOGLE_CLIENT_SECRET,
      callbackURL: env.PASSPORT_GOOGLE_CALLBACK_URL,
      scope: JSON.parse(env.PASSPORT_GOOGLE_SCOPE),
    }, (accessToken, refreshToken, profile, done) => {
      userController.saveAuthenticate('google', accessToken, refreshToken, profile, done);
    })
  );

  // Initialize Naver Strategy
  passport.use(
    new NaverStrategy({
      clientID: env.PASSPORT_NAVER_CLIENT_ID,
      clientSecret: env.PASSPORT_NAVER_CLIENT_SECRET,
      callbackURL: env.PASSPORT_NAVER_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
      const modifiedProfile = {
        ...profile,
        photos: [ { value: profile._json.profile_image } ],
      };
      userController.saveAuthenticate('naver', accessToken, refreshToken, modifiedProfile, done);
    })
  );

  // Initialize Kakao Strategy
  passport.use(
    new KakaoStrategy({
      clientID: env.PASSPORT_KAKAO_CLIENT_ID,
      clientSecret: env.PASSPORT_KAKAO_CLIENT_SECRET,
      callbackURL: env.PASSPORT_KAKAO_CALLBACK_URL,
    }, (accessToken, refreshToken, profile, done) => {
      const modifiedProfile = {
        ...profile,
        emails: [ { value: '' } ],
        photos: [ { value: profile._json.properties.profile_image } ],
      };
      userController.saveAuthenticate('kakao', accessToken, refreshToken, modifiedProfile, done);
    })
  );

  return passport;
};
