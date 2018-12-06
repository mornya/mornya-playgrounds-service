/*
 * 서버 부트스트랩 로더
 * 순차적으로 .env 설정 로딩 > DB연결 > 서버 기동을 실행한다.
 */
import chalk from 'chalk';
import env from './env';
import db from './db';
import router from './router';
import passports from './passports';
import server from './server';

// Echo a new line
console.info(); // eslint-disable-line no-console

env()
  .then(() => {
    console.info(`Application running in ${chalk.yellow(process.env.NODE_ENV)} mode..`); // eslint-disable-line no-console
  })
  .then(() => db.connect()) // Load database connection and start server
  .then(() => {
    // Initialize server and start listening (test env. does not start listening)
    const { controllerMap, routeSet } = router(db.modelMap);
    const passport = passports(controllerMap);
    return server.start(routeSet, passport);
  })
  .then(({ HTTP_PORT, HTTPS_PORT }) => {
    console.info(
      'Listening on port', [
        HTTP_PORT ? `${chalk.yellow(HTTP_PORT)}(HTTP)` : null,
        HTTPS_PORT ? `${chalk.yellow(HTTPS_PORT)}(HTTPS)` : null,
      ].filter(Boolean).join(' / ')
    ); // eslint-disable-line no-console
  })
  .catch((err) => {
    if (err) {
      console.error(chalk.red(`[ERROR] Server cannot start: ${err}`));
    }
    db.disconnect();
    server.stop();
  });
