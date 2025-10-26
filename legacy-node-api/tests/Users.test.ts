import { StatusCodes } from 'http-status-codes';
import { testServer } from './jest.setup';

describe('sign.up', () => {
  it('success', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.CREATED);
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number');
  });
  it('without name', async () => {
    const res = await testServer.post('/sign-up').send({
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without email', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid email', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid password', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '12345678',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('with email already registered', async () => {
    const resCreate = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '123456.sS',
    });
    expect(resCreate.statusCode).toBe(StatusCodes.CREATED);

    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user.same@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without body', async () => {
    const res = await testServer.post('/sign-up').send({});
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(3);
  });
  it('without password', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User',
      email: 'create.user@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to short', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'CC',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('name to long', async () => {
    const res = await testServer.post('/sign-up').send({
      name: 'Create User 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890',
      email: 'create.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});

describe('sign.in', () => {
  beforeAll(async () => {
    await testServer.post('/sign-up').send({
      name: 'Sign In User',
      email: 'sign.in.user@mail.com',
      password: '123456.sS',
    });
  });
  it('success', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.OK);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('expiresIn');
  });
  it('without email', async () => {
    const res = await testServer.post('/sign-in').send({
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without password', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
    });
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('without body', async () => {
    const res = await testServer.post('/sign-in').send({});
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(2);
  });
  it('invalid email', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'invalid@mail.com',
      password: '123456.sS',
    });
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
  it('invalid password', async () => {
    const res = await testServer.post('/sign-in').send({
      email: 'sign.in.user@mail.com',
      password: '123456',
    });
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors.length).toBe(1);
  });
});
