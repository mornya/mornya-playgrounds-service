/*
 * MongoDB 설정 및 초기화
 */
import chalk from 'chalk';
import mongoose from 'mongoose';
import models from './models';

// Node.js의 native Promise 사용
mongoose.Promise = global.Promise;
// 이벤트 설정
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', () => {
  console.info(`Connecting ${chalk.green('MongoDB')} was succeed..`); // eslint-disable-line no-console
});
mongoose.connection.once('close', () => {
  console.info(`Disconnecting ${chalk.green('MongoDB')} was succeed..`); // eslint-disable-line no-console
});

// 모델 등록
// Schema type references: @see http://mongoosejs.com/docs/schematypes.html
//console.info(`\nGet schemas from models:`);
const modelMap = Object.entries(models).reduce((modelSet, [ k, v ]) => {
  //console.info(`  ${k}`);
  const collection = `${k.charAt(0).toLowerCase()}${k.slice(1)}`; // 컬렉션명 정의 (ex. UserInfo = userInfo)
  const schema = new mongoose.Schema(v, { timestamps: true, collection });

  // create: new this 때문에 array function 사용하지 않음
  schema.statics.create = function (payload) {
    const curr = new this(payload);
    return curr.save();
  };
  schema.statics.findAll = function () {
    return this.find({});
  };

  modelSet[ k ] = mongoose.model(k, schema);
  return modelSet;
}, {});

/**
 * Exports MongoDB Server connection promise
 */
const connect = () => {
  const { MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_DATABASE } = process.env;
  const mongodbUri = `mongodb://${MONGODB_USER}:${encodeURIComponent(MONGODB_PASS)}@${MONGODB_HOST}/${MONGODB_DATABASE}`;
  const mongodbOpts = {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  return mongoose.connect(mongodbUri, mongodbOpts);
};

const disconnect = () => mongoose.disconnect();

export default {
  modelMap,
  connect,
  disconnect,
};
