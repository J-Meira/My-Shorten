import { knex } from 'knex';

const knexEnv = require('../../knex.env');
const env = process.env.NODE_ENV || 'development';

export const Knex = knex(knexEnv[env]);
