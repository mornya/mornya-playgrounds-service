/*
 * .env 환경설정 로딩
 */
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load .env configuration
export default () => {
  return new Promise((resolve, reject) => {
    const envPath = path.resolve(__dirname, '..', '.env');

    if (fs.existsSync(envPath)) {
      const result = dotenv.config({ path: envPath });
      if (result.error) {
        reject(result.error);
      } else {
        resolve();
      }
    } else {
      reject('".env" file not exists!');
    }
  });
};
