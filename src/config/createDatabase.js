require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    });

    const dbName = process.env.DB_NAME;

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' creado o ya existe.`);

    await connection.end();
  } catch (err) {
    console.error('Error creando la base de datos:', err);
  }
}

createDatabase()
  .then(() => {
    console.log('Database creation script completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error in database creation script:', err);
    process.exit(1);
  });
