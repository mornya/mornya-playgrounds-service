import request from 'supertest';
import init from './init';

let app;
beforeAll(async () => app = await init.start());
afterAll(() => init.stop());

describe('Route tests', () => {
  it('[GET /] should render properly', async () => {
    await request(app)
      .get('/')
      .expect(200);
  });

  it('[GET /list] should render properly with valid parameters', async () => {
    await request(app)
      .get('/list')
      .query({ title: 'List title' })
      .expect(200);
  });

  it('[GET /list] should error without a valid parameter', async () => {
    await request(app)
      .get('/list')
      .expect(500);
  });

  it('[GET /404] should return 404 for non-existent URLs', async () => {
    await request(app)
      .get('/404')
      .expect(404);
    await request(app)
      .get('/notfound')
      .expect(404);
  });
});
