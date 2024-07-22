/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tipos').del()
  await knex('tipos').insert([
    {nombre:"Proyecto de Grado"},
    {nombre:"Tesis"},
    {nombre:"Trabajo Dirigido "},    
  ]);
};
