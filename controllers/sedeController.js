import { pool } from "../db.js";

export const Sede = {
  getSedes: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT s.*, 
              m.nombre AS nombre_municipio, 
              p.nombre AS nombre_coordinador
        FROM guayaba.Sede s
        INNER JOIN guayaba.Municipio m ON s.municipio = m.id
        LEFT JOIN guayaba.Persona p ON s.coordinador = p.id_persona;`
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener sedes:", error.message);
      res.status(500).json({ error: "Error al obtener las sedes" });
    }
  },

  getSedeById: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT s.id_sede, s.nombre, s.municipio, s.coordinador, 
        m.nombre AS nombre_municipio, p.nombre AS nombre_coordinador
        FROM guayaba.Sede s
        INNER JOIN guayaba.Municipio m ON s.municipio = m.id
        LEFT JOIN guayaba.Persona p ON s.coordinador = p.id_persona
        WHERE s.id_sede = $1`,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Sede no encontrada" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al obtener sede:", error.message);
      res.status(500).json({ error: "Error al obtener la sede" });
    }
  },

  createSede: async (req, res) => {
    const { nombre, municipio, coordinador } = req.body;

    if (!nombre || !municipio || !coordinador) {
      return res
        .status(400)
        .json({ error: "Todos los campos son requeridos." });
    }

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Sede WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.json({
          message: "La sede ya está registrada.",
          registered: true,
        });
      }

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const sedeResult = await pool.query(
        `INSERT INTO guayaba.Sede (nombre, municipio, coordinador) VALUES ($1, $2, $3) RETURNING *`,
        [nombre, municipio, coordinador]
      );

      if (sedeResult.rowCount === 0) {
        throw new Error("No se pudo crear la sede.");
      }

      await pool.query("COMMIT"); // Confirmar transacción

      return res.json({
        message: "Sede creada con éxito.",
        registered: true,
        sede: sedeResult.rows[0],
      });
    } catch (err) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al crear la sede:", err.message);
      res.status(500).json({ error: "Error al crear la sede." });
    }
  },

  updateSede: async (req, res) => {
    const { id_sede, nombre, municipio, coordinador } = req.body;
    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const updateSedeQuery = `
      UPDATE guayaba.Sede
      SET nombre = $2, municipio = $3, coordinador = $4
      WHERE id_sede = $1
      RETURNING *;
      `;

      const values = [id_sede, nombre, municipio, coordinador];
      const result = await pool.query(updateSedeQuery, values);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Sede no encontrada" });
      }

      await pool.query("COMMIT"); // Confirmar transacción

      res.status(200).json({
        message: "Sede actualizada exitosamente",
        sede: result.rows[0],
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al actualizar la sede:", error.message);
      res.status(500).json({ error: "Hubo un problema al actualizar la sede." });
    }
  },

  addSedesManual: async (req, res) => {
    const { sedes } = req.body; // Array de sedes
    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const addedSedes = [];
      for (const sede of sedes) {
        const { nombre, municipio, coordinador } = sede;

        const result = await pool.query(
          `INSERT INTO guayaba.Sede (nombre, municipio, coordinador)
           VALUES ($1, $2, $3) RETURNING *`,
          [nombre, municipio, coordinador]
        );

        addedSedes.push(result.rows[0]);
      }
      await pool.query("COMMIT"); // Confirmar transacción
      res.status(200).json({
        message: "Sedes añadidas exitosamente.",
        sedes: addedSedes,
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir sedes:", error.message);
      res.status(500).json({
        error: error.message || "Hubo un problema al añadir las sedes.",
      });
    }
  },

  deleteSede: async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const deleteQuery = `DELETE FROM guayaba.Sede WHERE id_sede = $1 RETURNING *;`;
      const result = await pool.query(deleteQuery, [id]);

      if (result.rowCount === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Sede no encontrada" });
      }

      await pool.query("COMMIT"); // Confirmar transacción

      res.status(200).json({
        message: "Sede eliminada exitosamente",
        sede: result.rows[0],
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      if (error.code === '23503') { // Foreign key violation
        res.status(400).json({ error: "No se puede eliminar la sede hasta que se eliminen los edificios y otros registros asociados." });
      } else {
        console.error("Error al eliminar la sede:", error.message);
        res.status(500).json({ error: "Hubo un problema al eliminar la sede." });
      }
    }
  },
};