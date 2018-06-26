export default {
  userId: { type: String, required: true }, // Identifier
  provider: { type: String, required: true }, // social provider (facebook, naver, kakao, ...)
  userName: { type: String, required: true },
  password: { type: String },
  group: { type: String, default: 'NONE' },
  role: { type: String, required: true, default: 'NONE' },
  // optional information
  photoUrl: { type: String },
  email: { type: String },
  phone: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
};
