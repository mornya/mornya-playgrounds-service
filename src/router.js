/*
 * express.js 라우팅 컨트롤러 설정
 */
import { Router } from 'express';
import controllers from './controllers';

// Set controllers and routers from controllers
//console.info(`\nGet routes from controllers:`);

export default (modelMap) => {
  const controllerMap = {};
  const routeSet = Object.entries(controllers).reduce((router, [ k, v ]) => {
    //console.info(`  ${k}`);
    if (typeof v === 'function') {
      const controller = new v(router, modelMap); // 라우터와 모델 객체 연결
      controllerMap[ k ] = controller;
      return controller.router;
    }
  }, Router({}));

  return {
    controllerMap,
    routeSet,
  };
};
