/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("documentos", function (table) {
    table.increments("id_documento").primary().unsigned();    
    table.string("titulo", 255).notNullable();
    table.string("autor", 255).notNullable();
    table.integer("anho").notNullable();
    table.string("sede", 255).notNullable();
    table.string("ruta_pdf", 255).notNullable();
    table.integer("id_facultad_fk").unsigned().notNullable();
    table.integer("id_carrera_fk").unsigned().notNullable();
    table.integer("id_tipo_fk").unsigned().notNullable();
    table.foreign("id_facultad_fk").references("id_facultad").inTable("facultades");
    table.foreign("id_carrera_fk").references("id_carrera").inTable("carreras");
    table.foreign("id_tipo_fk").references("id_tipo").inTable("tipos");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('documentos');
};
