import env from '../src/env';
import db from '../src/db';
import router from '../src/router';
import passports from '../src/passports';
import server from '../src/server';

const start = () =>
  env()
    //.then(db.connect()) // DB connection is not needed for test
    .then(() => {
      const { controllerMap, routeSet } = router(db.modelMap);
      const passport = passports(controllerMap);
      return server.start(routeSet, passport);
    });

const stop = () => {
  db.disconnect()
    .then(server.stop);
};

export default {
  start,
  stop,
};
