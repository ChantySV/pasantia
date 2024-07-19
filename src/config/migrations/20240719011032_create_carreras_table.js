/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('carreras', function(table) {
        table.increments('id_carrera').primary();
        table.string('nombre', 45).notNullable().unique();
        table.integer('id_facultad_fk').unsigned().notNullable();
        table.foreign('id_facultad_fk').references('id_facultad').inTable('facultades');      
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('carreras');
};
