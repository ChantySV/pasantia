/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('documentos', function(table) {
        table.increments('id_documento').primary();
        table.string('tipo', 255).notNullable();
        table.string('facultad', 255).notNullable();
        table.string('carrera', 255).notNullable();
        table.string('titulo', 255);
        table.string('autor', 255).notNullable();
        table.integer('anho').notNullable();
        table.string('sede', 255).notNullable();
        table.string('ruta_pdf', 255).notNullable();
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('documentos');
};
