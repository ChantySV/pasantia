/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  await knex("facultades").del();
  await knex("facultades").insert([
    {
      nombre: "Ciencias Jurídicas",
    },
    {
      nombre: "Ciencias Empresariales",
    },
    {
      nombre: "Ciencias Sociales",
    },
    {
      nombre: "Ingeniería",
    },
    {
      nombre: "Ciencias de la Salud",
    },
  ]).then(function () {
    // Ahora inserta datos en `carreras`
    return knex('carreras').insert([
      { id_facultad_fk: 1, nombre: 'Derecho' },
      { id_facultad_fk: 2, nombre: 'Administración de Empresas' },
      { id_facultad_fk: 2, nombre: 'Contaduría Pública' },
      { id_facultad_fk: 2, nombre: 'Ingeniería Comercial' },
      { id_facultad_fk: 2, nombre: 'Marketing y Publicidad' },
      { id_facultad_fk: 3, nombre: 'Ciencias de la Comunicación Social' },
      { id_facultad_fk: 3, nombre: 'Psicología' },
      { id_facultad_fk: 3, nombre: 'Psicopedagogía' },
      { id_facultad_fk: 3, nombre: 'Relaciones Internacionales' },
      { id_facultad_fk: 3, nombre: 'Gestión del Turismo' },
      { id_facultad_fk: 4, nombre: 'Ingeniería Civil' },
      { id_facultad_fk: 4, nombre: 'Ingeniería de Sistemas' },
      { id_facultad_fk: 4, nombre: 'Ingeniería en Gestión Ambiental' },
      { id_facultad_fk: 4, nombre: 'Ingeniería en Gestión Petrolera' },
      { id_facultad_fk: 4, nombre: 'Ingeniería en Redes y Telecomunicaciones' },
      { id_facultad_fk: 4, nombre: 'Ingeniería Industrial' },
      { id_facultad_fk: 5, nombre: 'Medicina' },
      { id_facultad_fk: 5, nombre: 'Fisioterapia y Kinesiología' }
    ]);
  });
};
