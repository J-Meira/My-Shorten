import { Knex } from 'knex';
import { ETableNames } from '../ETableNames';

export async function up(knex: Knex) {
  return knex.schema
    .createTable(ETableNames.urls, (table) => {
      table.bigIncrements('id').primary().index();
      table.string('code', 10).unique().index().notNullable();
      table.string('original', 1000).notNullable();
      table
        .bigInteger('userId')
        .unsigned()
        .index()
        .notNullable()
        .references('id')
        .inTable(ETableNames.users)
        .onUpdate('CASCADE')
        .onDelete('RESTRICT');
    })
    .then(() => {
      console.log(`# Created Table: ${ETableNames.urls}!`);
    });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(ETableNames.urls).then(() => {
    console.log(`# Dropped Table: ${ETableNames.urls}!`);
  });
}
