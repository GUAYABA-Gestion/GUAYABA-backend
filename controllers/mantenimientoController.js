import { pool } from "../db.js";
import { Mail } from "../middlewares/nodemailer.js";

export const Mantenimiento = {

  create: async (req, res) => {
    try {
      const requiredFields = ['id_espacio', 'id_encargado', 'estado', 'tipo', 'prioridad', 'plazo_ideal'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        });
      }

      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const { rows } = await pool.query(
        `INSERT INTO guayaba.Mantenimiento
        (id_espacio, id_encargado, tipo_contrato, tipo, estado, necesidad, prioridad, detalle, fecha_asignacion, plazo_ideal, terminado, observación) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *`,
        [
          req.body.id_espacio,
          req.body.id_encargado,
          req.body.tipo_contrato || 'interno',
          req.body.tipo,
          req.body.estado,
          req.body.necesidad || null,
          req.body.prioridad,
          req.body.detalle || null,
          req.body.fecha_asignacion || new Date().toISOString(),
          req.body.plazo_ideal,
          req.body.terminado || false,
          req.body.observación || null
        ]
      );

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error creando mantenimiento:", error);
      res.status(500).json({ success: false, error: "Error al crear mantenimiento" });
    }
  },

  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM guayaba.Mantenimiento');
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo Mantenimientos:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.body;
      const { rows } = await pool.query(
        'SELECT * FROM guayaba.Mantenimiento WHERE id_mantenimiento = $1',
        [id]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo mantenimientos:", error);
      res.status(500).json({ success: false, error: "Error al obtener historial de mantenimiento" });
    }
  },

  updateEstado: async (req, res) => {
    try {
      const { id, nuevoEstado } = req.body;

      if (!nuevoEstado) {
        return res.status(400).json({
          success: false,
          error: "Se requiere el campo 'nuevoEstado'"
        });
      }

      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const { rows } = await pool.query(
        `UPDATE guayaba.Mantenimiento 
        SET estado = $1, fecha_fin = $2, terminado = $3 
        WHERE id_mantenimiento = $4 
        RETURNING *`,
        [nuevoEstado, nuevoEstado === 'Completo' ? new Date() : null, nuevoEstado === 'Completo', id]
      );

      if (rows.length === 0) {
        await pool.query('ROLLBACK'); // Revertir transacción
        return res.status(404).json({ success: false, error: "Registro de mantenimiento no encontrado" });
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error actualizando estado:", error);
      res.status(500).json({ success: false, error: "Error al actualizar estado de mantenimiento" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.body;

      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const { rows } = await pool.query(
        'DELETE FROM guayaba.Mantenimiento WHERE id_mantenimiento = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        await pool.query('ROLLBACK'); // Revertir transacción
        return res.status(404).json({ success: false, error: "Registro de mantenimiento no encontrado" });
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error eliminando mantenimiento:", error);
      res.status(500).json({ success: false, error: "Error al eliminar registro de mantenimiento" });
    }
  },

  getByEspacios: async (req, res) => {
    const { ids_espacios } = req.body;

    if (!Array.isArray(ids_espacios) || ids_espacios.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de IDs de espacios válida."
      });
    }

    try {
      const placeholders = ids_espacios.map((_, index) => `$${index + 1}`).join(', ');
      const query = `SELECT * FROM guayaba.Mantenimiento WHERE id_espacio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_espacios);

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo mantenimientos por espacios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  verificarYEnviarAlertas: async () => {
    try {
      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos a -1 para indicar actualización automática
      await pool.query(`SET LOCAL app.current_user_id = '-1'`);

      const { rows } = await pool.query(`
        SELECT m.*, p.correo AS encargado_correo
        FROM guayaba.Mantenimiento m
        JOIN guayaba.Persona p ON m.id_encargado = p.id_persona
        WHERE m.terminado = FALSE
        AND CURRENT_DATE > (m.fecha_asignacion + INTERVAL '1 day' * m.plazo_ideal)
      `);

      if (rows.length === 0) {
        console.log("No hay mantenimientos atrasados.");
        await pool.query('COMMIT'); // Confirmar transacción
        return;
      }

      for (const mantenimiento of rows) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: mantenimiento.encargado_correo,
          subject: `Alerta de Mantenimiento Atrasado: ${mantenimiento.tipo}`,
          text: `El mantenimiento con ID ${mantenimiento.id_mantenimiento} está atrasado. Por favor, tome las acciones necesarias.`
        };

        await Mail.sendAlertEmail(mailOptions);

        // Actualizar el estado y la prioridad del mantenimiento
        await pool.query(
          `UPDATE guayaba.Mantenimiento
           SET estado = 'Pendiente', prioridad = 'Alta'
           WHERE id_mantenimiento = $1`,
          [mantenimiento.id_mantenimiento]
        );
      }

      await pool.query('COMMIT'); // Confirmar transacción
      console.log("Alertas enviadas y mantenimientos actualizados correctamente.");
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error verificando y enviando alertas:", error);
    }
  },
};