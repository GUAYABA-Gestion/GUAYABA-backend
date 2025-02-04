
const createSede = async (req, res) => {
  const { nombre, municipio, coordinador } = req.body;

  if (!nombre || !municipio || !coordinador) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    const checkResult = await pool.query(
      `SELECT * FROM ${TABLES.SEDE} WHERE nombre = $1`,
      [nombre]
    );

    if (checkResult.rowCount > 0) {
      return res.json({ message: "La sede ya está registrada.", registered: true });
    }

    const sedeResult = await pool.query(
      `INSERT INTO ${TABLES.SEDE} (nombre, municipio, coordinador) VALUES ($1,
      $2, $3, $4, NULL, NULL) RETURNING id_persona`,
      [nombre, municipio, coordinador]
    );

    if (sedeResult.rowCount === 0) {
      throw new Error("No se pudo crear la sede.");
    }

    return res.json({ message: "Sede creada con éxito.", registered: true });
  } catch (err) {
    console.error("Error al crear la sede:", err.message);
    res.status(500).json({ error: "Error al crear la sede." });
  }
}

const updateSede = async (req, res) => {
  const { id_sede, nombre, municipio, coordinador } = req.body;

  try {
    const updateSedeQuery = `
    UPDATE ${TABLES.SEDE}
    SET nombre = $2, municipio = $3, coordinador = $4
    WHERE id_sede = $1;
    `;

    const values = [id_sede, nombre, municipio, coordinador];
    await pool.query(updateSedeQuery, values);

    res.status(200).json({ message: "Sede actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la sede:", error.message);
    res.status(500).json({ error: "Hubo un problema al actualizar la sede." });
  }
}

const createEdificio = async (req, res) => {
  const { id_sede, id_titular, nombre, direccion, categoria, propiedad,
    area_terreno, area_construida, cert_uso_suelo } = req.body;

  if (!id_sede || !id_titular || !nombre || !direccion || !categoria || !propiedad,
    !area_terreno || !area_construida || !cert_uso_suelo) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }

  try {
    const checkResult = await pool.query(
      `SELECT * FROM ${TABLES.EDIFICIO} WHERE nombre = $1`,
      [nombre]
    );

    if (checkResult.rowCount > 0) {
      return res.json({ message: "El edificio ya está registrado.", registered: true });
    }

    const edificioResult = await pool.query(
      `INSERT INTO ${TABLES.SEDE} (id_sede, id_titular, nombre, direccion,
      categoria, propiedad, area_terreno, area_construida, cert_uso_suelo) VALUES ($1,
      $2, $3, $4, NULL, NULL) RETURNING id_edificio`,
      [id_sede, id_titular, nombre, direccion, categoria, propiedad,
      area_terreno, area_construida, cert_uso_suelo]
    );

    if (edificioResult.rowCount === 0) {
      throw new Error("No se pudo crear el edificio.");
    }

    return res.json({ message: "Edificio creado con éxito.", registered: true });
  } catch (err) {
    console.error("Error al crear el edificio.", err.message);
    res.status(500).json({ error: "Error al crear el edificio." });
  }
}

const getEdificios = async (req, res) => {
  const { id_sede } = req.query;

  if (!id_sede) {
    return res.status(400).json({ error: "El parámetro id_edificio es requerido." });
  }

  try {
    const query = `
      SELECT id_edificio, nombre, direccion, categoria, propiedad, area_terreno,
      area_construida, cert_uso_suelo
      FROM ${TABLES.EDIFICIO}
      INNER JOIN ${TABLES.SEDE} ON ${TABLES.EDIFICIO}.id_sede = ${TABLES.SEDE}.id_sede
      WHERE ${TABLES.EDIFICIO}.id_sede = $1;
    `;

    const result = await pool.query(query, [id_sede]);

    res.json(result);
  } catch (error) {
    console.error("Error al obtener los edificios:", error.message);
    res.status(500).json({ error: "Error al obtener los edificios." });
  }
}

const updateEdificio = async (req, res) => {
  const { id_sede, id_titular, nombre, direccion, categoria, propiedad,
    area_terreno, area_construida, cert_uso_suelo } = req.body;

  try {
    const updateEdificioQuery = `
    UPDATE ${TABLES.EDIFICIO}
    SET id_sede = $2, id_titular = $3 nombre = $4, direccion = $5, categoria = $6,
    propiedad = $7, area_terreno = $8, area_construida = $9, cert_uso_suelo = $10
    WHERE id_edificio = $1;
    `;

    const values = [id_sede, nombre, municipio, coordinador];
    await pool.query(updateSedeQuery, values);

    res.status(200).json({ message: "Sede actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la sede:", error.message);
    res.status(500).json({ error: "Hubo un problema al actualizar la sede." });
  }
}

const updateUser = async (req, res) => {
  const { id_persona, nombre, correo, telefono, rol, detalles, id_sede } = req.body;

  try {
    const updatePersonaQuery = `
    UPDATE ${TABLES.PERSONA}
    SET nombre = $2, correo = $3, telefono = $4, rol = $5, detalles = $6, id_sede = $7
    WHERE id_persona = $1;
    `;

    const values = [id_persona, nombre, correo, telefono, rol, detalles, id_sede]
    await pool.query(updatePersonaQuery, values);

    res.status(200).json({ message: "Cuenta actualizada exitosamente." });
  } catch (error) {
    console.error("Error al actualizar la cuenta:", error.message);
    res.status(500).json({ error: "Hubo un problema al actualizar la cuenta." });
  }

}

const getAuditoria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tabla_afectada, operacion, fecha_hora, datos_anteriores, datos_nuevos   
      FROM ${TABLES.AUDITORIA} 
      ORDER BY fecha_hora desc;
    `)
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener historial:", error.message);
    res.status(500).json({ error: "Error al obtener el historial" });
  }
}

// Constantes para el esquema y las tablas
const SCHEMA = "guayaba";
const TABLES = {
  SEDE: `${SCHEMA}.Sede`,
  EDIFICIO: `${SCHEMA}.Edificio`,
  USUARIO: `${SCHEMA}.Usuario`,
  PERSONA: `${SCHEMA}.Persona`,
  AUDITORIA: `${SCHEMA}.Auditoria`,
// WIP
  MANTENMIENTO: `${SCHEMA}.Mantenimiento`,
  ESPACIO: `${SCHEMA}.Espacio`,

};

export {
  initializeDB,
  query,
  ping,
  createSede,
  getSedes,
  updateSede,
  createEdificio,
  getEdificios,
  updateEdificio,
  checkUser,
  registerUser,
  updateUser,
  getPersonas,
  getAccountInfo,
  deleteAccount,
  getAuditoria,

};
