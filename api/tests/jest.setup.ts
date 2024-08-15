import supertest from 'supertest';

import { server } from '../src/server';
import { Knex } from '../src/database/knex';

beforeAll(async () => {
  await Knex.migrate.latest();
});

export const testServer = supertest(server);

afterAll(async () => {
  await Knex.destroy();
});
