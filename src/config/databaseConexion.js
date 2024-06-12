require('dotenv').config();
const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

conexion.connect(function(err) {
  if (err) {
    throw err;
  } else {
    console.log('Conexion exitosa !!!');
  }
});

module.exports = conexion;
