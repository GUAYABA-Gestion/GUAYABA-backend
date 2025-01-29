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
      `SELECT * FROM ${TABLES.PERSONA} WHERE correo = $1`,
      [email]
    );

    if (result.rowCount > 0) {
      res.json({ exists: true , user: result.rows[0]});
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error("Error al verificar usuario:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const registerUser = async (req, res) => {
  const { correo, nombre, sede_id } = req.body;

  if (!correo || !nombre || !sede_id) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    // Verificar si el usuario ya existe en la tabla Usuario
    const checkResult = await pool.query(
      `SELECT * FROM ${TABLES.PERSONA} WHERE correo = $1`,
      [correo]
    );

    if (checkResult.rowCount > 0) {
      // Si el usuario ya existe, devolver una respuesta adecuada
      return res.json({ message: "El usuario ya está registrado.", registered: true });
    }

    // Insertar en la tabla persona
    const rol = `Usuario`;
    const usuarioResult = await pool.query(
      `INSERT INTO ${TABLES.PERSONA} (correo, rol, nombre, id_sede, telefono, detalles) VALUES ($1, $2, $3, $4, NULL, NULL) RETURNING id_persona`,
      [correo, rol, nombre, sede_id]
    );

    if (usuarioResult.rowCount === 0) {
      throw new Error("No se pudo crear el usuario.");
    }

    return res.json({ message: "Usuario registrado con éxito.", registered: true });
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getPersonas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_persona, id_sede, correo, nombre, telefono, rol,detalles FROM ${TABLES.PERSONA}`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener personas:", error.message);
    res.status(500).json({ error: "Error al obtener las personas" });
  }
};

const getAccountInfo = async (req, res) => {
  const { id_persona } = req.query; // Obtenemos el id_persona de los parámetros de la consulta

  if (!id_persona) {
    return res.status(400).json({ error: "El parámetro id_persona es requerido." });
  }

  try {
    // Realizamos el JOIN entre USUARIO y PERSONA
    const query = `
      SELECT 
        id_persona, 
        correo AS usuario_correo, 
        rol, 
        id_persona, 
        nombre, 
        telefono, 
        detalles
      FROM ${TABLES.PERSONA} 
      WHERE id_persona = $1;
    `;

    const result = await pool.query(query, [id_persona]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Respondemos con la información del usuario y persona en un solo objeto
    const accountInfo = result.rows[0];
    res.json(accountInfo);
  } catch (error) {
    console.error("Error al obtener información de la cuenta:", error.message);
    res.status(500).json({ error: "Error al obtener información de la cuenta." });
  }
};

const deleteAccount = async (req, res) => {
  const { id_persona } = req.body; // Obtenemos el id_usuario desde el cuerpo de la solicitud

  if (!id_persona) {
    return res.status(400).json({ error: "El parámetro id_persona es requerido." });
  }

  try {
    // Primero eliminamos la persona asociada
    const deletePersonaQuery = `
      DELETE FROM ${TABLES.PERSONA} WHERE id_persona = $1;
    `;
    await pool.query(deletePersonaQuery, [id_persona]);


    // Si todo salió bien, respondemos con un mensaje de éxito
    res.status(200).json({ message: "Cuenta eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error.message);
    res.status(500).json({ error: "Hubo un problema al eliminar la cuenta." });
  }
};

// Constantes para el esquema y las tablas
const SCHEMA = "guayaba";
const TABLES = {
  SEDE: `${SCHEMA}.Sede`,
  USUARIO: `${SCHEMA}.Usuario`,
  PERSONA: `${SCHEMA}.Persona`,
  
};

export {
  initializeDB,
  query,
  ping,
  getSedes,
  checkUser,
  registerUser,
  getPersonas,
  getAccountInfo,
  deleteAccount,
};
