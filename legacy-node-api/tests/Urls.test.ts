import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('urls.create', () => {
  let accessToken: string | undefined = undefined;

  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.urls@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.urls@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;
  });

  it('without token', async () => {
    const res = await testServer.post('/urls').send({
      url: 'http://jm.app.br'
    });
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('success', async () => {
    const res = await testServer
      .post('/urls')
      .send({
        url: 'http://jm.app.br'
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without url', async () => {
    const res = await testServer
      .post('/urls')
      .send({})
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('blank url', async () => {
    const res = await testServer
      .post('/urls')
      .send({
        url: ''
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(2);
  });
  it('invalid url', async () => {
    const res = await testServer
      .post('/urls')
      .send({
        url: 'abc'
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('urls.delete', () => {
  let accessToken: string | undefined = undefined;

  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.urls.del@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.urls.del@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;

  });

  it('without token', async () => {
    const res = await testServer.delete('/urls/1');
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('success', async () => {
    const resCreate = await testServer
      .post('/urls')
      .send({
        url: 'http://jm.app.br'
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .delete(`/urls/${resCreate.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NO_CONTENT);
    expect(res.body).toStrictEqual({});
  });
  it('string param', async () => {
    const res = await testServer
      .delete('/urls/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .delete('/urls/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without param', async () => {
    const res = await testServer
      .delete('/urls')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
  });
});

describe('urls.getAll', () => {
  let accessToken: string | undefined = undefined;

  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.urls.all@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.urls.all@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;

  });

  it('without token', async () => {
    const res = await testServer.get('/urls');
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('success', async () => {
    const resCreate = await testServer
      .post('/urls')
      .send({
        url: 'http://jm.app.br'
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .get('/urls')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('records');
    expect(res.body.records.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('totalOfRecords');
    expect(res.body.totalOfRecords).toBeGreaterThan(0);
  });
});

describe('urls.getById', () => {
  let accessToken: string | undefined = undefined;

  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'User Tests',
      email: 'user.test.urls.get@mail.com',
      password: '123456.sS',
    });
    const signIn = await testServer.post('/sign-in').send({
      email: 'user.test.urls.get@mail.com',
      password: '123456.sS',
    });
    accessToken = signIn.body.accessToken;

  });

  it('without token', async () => {
    const res = await testServer.get('/urls/1');
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('success', async () => {
    const resCreate = await testServer
      .post('/urls')
      .send({
        url: 'http://jm.app.br'
      })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer
      .get(`/urls/${resCreate.body.id}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('original', 'http://jm.app.br');
  });
  it('string param', async () => {
    const res = await testServer
      .get('/urls/string')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('not found', async () => {
    const res = await testServer
      .get('/urls/99999')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

