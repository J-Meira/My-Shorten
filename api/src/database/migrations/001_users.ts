import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.users, (table) => {
      table.bigIncrements('id').primary().index();
      table.string('name', 150).index().notNullable();
      table.string('email', 150).index().unique().notNullable();
      table.string('password').notNullable();
    })
    .then(() => {
      console.log(`# Created Table: ${ETableNames.users}!`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.users).then(() => {
    console.log(`# Dropped Table: ${ETableNames.users}!`);
  });
}
