// 아래 오브젝트에는 사용 편의상 이름에서 'Controller'를 제외한 키 값으로 등록한다.
export default {
  AssetUpload: require('./AssetUploadController').default,
  Auth: require('./AuthController').default,
  Root: require('./RootController').default,
  Sample: require('./SampleController').default,
  SendMail: require('./SendMailController').default,
  User: require('./UserController').default,
};
