/*
 * Adaptador de la base de Datos SIGFVI
 * (Posible mejora), Incluir variables de entorno para la Separación de credenciales.
 * (Posible mejora),
 * podriamos mysql.createPool en lugar de mysql.createConnection, para evitar la saturacion y sobrecalentamiento de la base de datos
 */

const fs = require('fs');
const path = require('path');

const caCertPath = path.join(
  __dirname,
  '../certs/DigitalCertGlobalRootCA.crt.pem'
);

let caCert;
try {
  caCert = fs.readFileSync(caCertPath);
} catch {
  console.error(`Error al leer el certificado: ${error.message}`);
  process.exit(1);
}

const mysql = require('mysql2'); // importar el modulo de mysql
const nomDatabase = 'SIGFVI_V3'; // nombre de la base de datos.

const DB_DATABASE = process.env.DB_DATABASE;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PORT = process.env.DB_PORT;

// Conexion base de datos
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port:DB_PORT,
  ssl: {
    ca: caCert,
  },
});

db.connect((err) => {
  if (err) {
    console.error(
      '\n\x1b[31m',
      'Errorr al conectar en la base de datos.\n\n',
      err,
      '\x1b[0m\n'
    );
    return;
  }
  console.log(
    `\x1b[36m     Conexion Existosa a la base de datos. "${nomDatabase}"`,
    '\x1b[0m\n'
  );

  console.log(process.env.DB_DATABASE);
  console.log(process.env.DB_PASSWORD);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_USER);
});

// Proceso importante, abre la conexion a la base de datos, cuando esta abirta recibe, y cuando no se cierra.
// Manejamos la se;a SIGINT
process.on('SIGINT', () => {
  db.end();
  process.exit();
});

module.exports = db;
