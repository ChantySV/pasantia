/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  // Borrar todas las filas existentes
  await knex("usuarios").del();

  // Inserta nuevos registros
  await knex("usuarios").insert([
    {
      nombre: "UPDS",
      contrasenha: await bcrypt.hash("DomingoSavio", 10),
    },
  ]);
};
