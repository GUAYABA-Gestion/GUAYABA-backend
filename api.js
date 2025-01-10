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
    const result = await pool.query(query);
    console.log('Query completada correctamente.');
    return result; // Retornar el resultado de la consulta
  } catch (err) {
    console.error('Error al ejecutar la query', err);
    throw err; // Re-lanzar el error para manejarlo donde se llame
  }
};

const getSedes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id_sede, nombre FROM ${TABLES.SEDE}`);
    res.json(result.rows); // Devuelve un JSON con las sedes
  } catch (error) {
    console.error("Error al obtener sedes:", error.message);
    res.status(500).json({ error: "Error al obtener las sedes" });
  }
};

const checkUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El correo es requerido." });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${TABLES.USUARIO} WHERE correo = $1`,
      [email]
    );

    if (result.rowCount > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error al verificar usuario:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const registerUser = async (req, res) => {
  const { email, nombre, sede_id } = req.body;

  if (!email || !nombre || !sede_id) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    // Verificar si el usuario ya existe en la tabla Usuario
    const checkResult = await pool.query(
      `SELECT * FROM ${TABLES.USUARIO} WHERE correo = $1`,
      [email]
    );

    if (checkResult.rowCount > 0) {
      // Si el usuario ya existe, devolver una respuesta adecuada
      return res.json({ message: "El usuario ya está registrado.", registered: true });
    }

    // Insertar en la tabla Usuario
    const rol = `Usuario_${sede_id}`;
    const usuarioResult = await pool.query(
      `INSERT INTO ${TABLES.USUARIO} (correo, rol) VALUES ($1, $2) RETURNING id_usuario`,
      [email, rol]
    );

    if (usuarioResult.rowCount === 0) {
      throw new Error("No se pudo crear el usuario.");
    }

    const id_usuario = usuarioResult.rows[0].id_usuario;

    // Insertar en la tabla Persona
    const personaResult = await pool.query(
      `INSERT INTO ${TABLES.PERSONA} (id_usuario, nombre, correo, id_sede, telefono, detalles) 
       VALUES ($1, $2, $3, $4, NULL, NULL) RETURNING id_persona`,
      [id_usuario, nombre, email, sede_id]
    );

    if (personaResult.rowCount === 0) {
      throw new Error("No se pudo crear la persona.");
    }

    return res.json({ message: "Usuario registrado con éxito.", registered: true });
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Constantes para el esquema y las tablas
const SCHEMA = "guayaba";
const TABLES = {
  SEDE: `${SCHEMA}.Sede`,
  USUARIO: `${SCHEMA}.Usuario`,
};

export {
  initializeDB,
  query,
  ping,
  getSedes,
  checkUser,
  registerUser,
};
