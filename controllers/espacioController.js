import { pool } from "../db.js";

export const Espacio = {
  getByEdificios: async (req, res) => {
    const { ids_edificios } = req.body;

    if (!Array.isArray(ids_edificios) || ids_edificios.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de IDs de edificios válida."
      });
    }

    try {
      const placeholders = ids_edificios.map((_, index) => `$${index + 1}`).join(', ');
      const query = `SELECT * FROM guayaba.Espacio WHERE id_edificio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_edificios);

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo espacios por edificios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getById: async (req, res) => {
    const { id } = req.params;

    try {
      const query = `SELECT * FROM guayaba.Espacio WHERE id_espacio = $1`;
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Espacio no encontrado" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error al obtener el espacio:", error.message);
      res.status(500).json({ error: "Error al obtener el espacio." });
    }
  },

  addEspaciosManual: async (req, res) => {
    const { espacios } = req.body; // Array de espacios
    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const addedEspacios = [];
      for (const espacio of espacios) {
        const {
          id_edificio,
          nombre,
          estado,
          clasificacion,
          uso,
          tipo,
          piso,
          capacidad,
          mediciónmt2
        } = espacio;

        const result = await pool.query(
          `INSERT INTO guayaba.Espacio (id_edificio, nombre, estado, clasificacion, uso, tipo, piso, capacidad, mediciónmt2)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [
            id_edificio,
            nombre,
            estado,
            clasificacion,
            uso,
            tipo,
            piso,
            capacidad,
            mediciónmt2
          ]
        );

        addedEspacios.push(result.rows[0]);
      }
      await pool.query("COMMIT"); // Confirmar transacción
      res.status(200).json({
        message: "Espacios añadidos exitosamente.",
        espacios: addedEspacios,
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir espacios:", error.message);
      res.status(500).json({
        error: error.message || "Hubo un problema al añadir los espacios.",
      });
    }
  },

  createEspacio: async (req, res) => {
    const {
      id_edificio,
      nombre,
      estado,
      clasificacion,
      uso,
      tipo,
      piso,
      capacidad,
      mediciónmt2
    } = req.body;

    if (
      !id_edificio ||
      !nombre ||
      !estado ||
      !clasificacion ||
      !uso ||
      !tipo ||
      !piso ||
      !capacidad ||
      !mediciónmt2
    ) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
      await pool.query('BEGIN'); // Iniciar transacción

      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Espacio WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        await pool.query('ROLLBACK'); // Revertir transacción
        return res.json({
          message: "El espacio ya está registrado.",
          registered: true,
        });
      }

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const espacioResult = await pool.query(
        `INSERT INTO guayaba.Espacio (id_edificio, nombre, estado, clasificacion, uso, tipo, piso, capacidad, mediciónmt2)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_espacio`,
        [
          id_edificio,
          nombre,
          estado,
          clasificacion,
          uso,
          tipo,
          piso,
          capacidad,
          mediciónmt2
        ]
      );

      if (espacioResult.rowCount === 0) {
        throw new Error("No se pudo crear el espacio.");
      }

      await pool.query('COMMIT'); // Confirmar transacción

      return res.json({
        message: "Espacio creado con éxito.",
        registered: true,
        espacio: espacioResult.rows[0],
      });
    } catch (err) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error al crear el espacio.", err.message);
      res.status(500).json({ error: "Error al crear el espacio." });
    }
  },

  updateEspacio: async (req, res) => {
    const {
      id_espacio,
      id_edificio,
      nombre,
      estado,
      clasificacion,
      uso,
      tipo,
      piso,
      capacidad,
      mediciónmt2
    } = req.body;

    if (
      !id_espacio ||
      !id_edificio ||
      !nombre ||
      !estado ||
      !clasificacion ||
      !uso ||
      !tipo ||
      !piso ||
      !capacidad ||
      !mediciónmt2
    ) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    try {
      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const updateResult = await pool.query(
        `UPDATE guayaba.Espacio
         SET id_edificio = $1, nombre = $2, estado = $3, clasificacion = $4, uso = $5, tipo = $6, piso = $7, capacidad = $8, mediciónmt2 = $9
         WHERE id_espacio = $10 RETURNING *`,
        [
          id_edificio,
          nombre,
          estado,
          clasificacion,
          uso,
          tipo,
          piso,
          capacidad,
          mediciónmt2,
          id_espacio
        ]
      );

      if (updateResult.rowCount === 0) {
        throw new Error("No se pudo actualizar el espacio.");
      }

      await pool.query('COMMIT'); // Confirmar transacción

      return res.json({
        message: "Espacio actualizado con éxito.",
        updated: true,
        espacio: updateResult.rows[0],
      });
    } catch (err) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error al actualizar el espacio.", err.message);
      res.status(500).json({ error: "Error al actualizar el espacio." });
    }
  },

  deleteEspacio: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "El ID del espacio es requerido." });
    }

    try {
      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const deleteResult = await pool.query(
        `DELETE FROM guayaba.Espacio WHERE id_espacio = $1 RETURNING id_espacio`,
        [id]
      );

      if (deleteResult.rowCount === 0) {
        throw new Error("No se pudo eliminar el espacio.");
      }

      await pool.query('COMMIT'); // Confirmar transacción

      return res.json({
        message: "Espacio eliminado con éxito.",
        deleted: true,
        espacio: deleteResult.rows[0],
      });
    } catch (err) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error al eliminar el espacio.", err.message);
      res.status(500).json({ error: "Error al eliminar el espacio." });
    }
  },
};