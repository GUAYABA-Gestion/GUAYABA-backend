import { config } from 'dotenv';
import pg from 'pg';

config();

let pool; // Variable para guardar la conexión

// Método para inicializar la conexión
const initializeDB = () => {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
};

const ping = async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en /ping:", error.message);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
};

// Función genérica para ejecutar consultas
const query = async (query) => {
  try {
    await pool.query(query);
    console.log('Query completada correctamente.');
  } catch (err) {
    console.error('Error al crear ejecutar la query', err);
  }
};

// Constantes para el esquema y las tablas
const SCHEMA = "ingsof2";
const TABLES = {
  PERSONA: `${SCHEMA}.persona`,
  MUNICIPIO: `${SCHEMA}.municipio`,
  VIVIENDA: `${SCHEMA}.vivienda`,
  PROPIEDAD_VIVIENDA: `${SCHEMA}.propiedad_vivienda`,
  NEGOCIO: `${SCHEMA}.negocio`,
  CABEZA_FAMILIA: `${SCHEMA}.cabeza_familia`,
};

export {
  initializeDB,
  query,
  ping,
};
