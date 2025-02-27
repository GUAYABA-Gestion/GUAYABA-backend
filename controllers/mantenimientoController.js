import { pool } from "../db.js";
import { Mail } from "../middlewares/nodemailer.js";

export const Mantenimiento = {

  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM guayaba.Mantenimiento');
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo Mantenimientos:", error.message);
      res.status(500).json({ error: "Error al obtener los mantenimientos." });
    }
  },

  update: async (req, res) => {
    const {
      id_mantenimiento,
      id_espacio,
      id_encargado,
      tipo_contrato,
      tipo,
      estado,
      necesidad,
      prioridad,
      detalle,
      fecha_asignacion,
      plazo_ideal,
      terminado,
      observación
    } = req.body;

    if (!id_mantenimiento) {
      return res.status(400).json({ error: "El campo 'id_mantenimiento' es requerido." });
    }

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const updateQuery = `
        UPDATE guayaba.Mantenimiento
        SET id_espacio = $2, id_encargado = $3, tipo_contrato = $4, tipo = $5, estado = $6,
        necesidad = $7, prioridad = $8, detalle = $9, fecha_asignacion = $10, plazo_ideal = $11,
        terminado = $12, observación = $13
        WHERE id_mantenimiento = $1
        RETURNING *;
      `;

      const values = [
        id_mantenimiento,
        id_espacio,
        id_encargado,
        tipo_contrato,
        tipo,
        estado,
        necesidad,
        prioridad,
        detalle,
        fecha_asignacion,
        plazo_ideal,
        terminado,
        observación
      ];

      const { rows } = await pool.query(updateQuery, values);

      if (rows.length === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Mantenimiento no encontrado" });
      }

      const mantenimiento = rows[0];

      // Obtener detalles del espacio, encargado y persona que actualizó el mantenimiento
      const { rows: espacioRows } = await pool.query(
        `SELECT e.id_edificio, e.nombre AS nombre_espacio, ed.nombre AS nombre_edificio, s.nombre AS nombre_sede, e.clasificacion
         FROM guayaba.Espacio e
         JOIN guayaba.Edificio ed ON e.id_edificio = ed.id_edificio
         JOIN guayaba.Sede s ON ed.id_sede = s.id_sede
         WHERE e.id_espacio = $1`,
        [mantenimiento.id_espacio]
      );

      const espacio = espacioRows[0];

      const { rows: actualizadorRows } = await pool.query(
        `SELECT correo FROM guayaba.Persona WHERE id_persona = $1`,
        [req.user.id_persona]
      );

      const actualizador = actualizadorRows[0];

      if (mantenimiento.id_encargado) {
        const { rows: encargadoRows } = await pool.query(
          `SELECT correo FROM guayaba.Persona WHERE id_persona = $1`,
          [mantenimiento.id_encargado]
        );

        const encargado = encargadoRows[0];

        const fechaInicio = new Date(mantenimiento.fecha_asignacion);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + mantenimiento.plazo_ideal);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: encargado.correo,
          subject: `Guayaba - Actualización de Mantenimiento: ${mantenimiento.tipo}`,
          text: `El mantenimiento para el espacio ${espacio.nombre_espacio} en el edificio ${espacio.nombre_edificio}, sede ${espacio.nombre_sede} ha sido actualizado. 
                 Clasificación: ${espacio.clasificacion}
                 Detalle: ${mantenimiento.detalle}
                 Fecha de Asignación: ${fechaInicio.toLocaleDateString()}
                 Fecha Ideal de Finalización: ${fechaFin.toLocaleDateString()}
                 Actualizado por: ${actualizador.correo}
                 Puede ver más detalles en: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/espacios?idEdificio=${espacio.id_edificio}`
        };

        await Mail.sendAlertEmail(mailOptions);
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ message: "Mantenimiento actualizado exitosamente", mantenimiento });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error actualizando mantenimiento:", error.message);
      res.status(500).json({ error: "Error al actualizar mantenimiento." });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query("BEGIN"); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);

      const deleteQuery = `DELETE FROM guayaba.Mantenimiento WHERE id_mantenimiento = $1 RETURNING *;`;
      const { rows } = await pool.query(deleteQuery, [id]);

      if (rows.length === 0) {
        await pool.query("ROLLBACK"); // Revertir transacción
        return res.status(404).json({ error: "Mantenimiento no encontrado" });
      }

      const mantenimiento = rows[0];

      // Obtener detalles del espacio, encargado y persona que eliminó el mantenimiento
      const { rows: espacioRows } = await pool.query(
        `SELECT e.id_edificio, e.nombre AS nombre_espacio, ed.nombre AS nombre_edificio, s.nombre AS nombre_sede, e.clasificacion
         FROM guayaba.Espacio e
         JOIN guayaba.Edificio ed ON e.id_edificio = ed.id_edificio
         JOIN guayaba.Sede s ON ed.id_sede = s.id_sede
         WHERE e.id_espacio = $1`,
        [mantenimiento.id_espacio]
      );

      const espacio = espacioRows[0];

      const { rows: eliminadorRows } = await pool.query(
        `SELECT correo FROM guayaba.Persona WHERE id_persona = $1`,
        [req.user.id_persona]
      );

      const eliminador = eliminadorRows[0];

      if (mantenimiento.id_encargado) {
        const { rows: encargadoRows } = await pool.query(
          `SELECT correo FROM guayaba.Persona WHERE id_persona = $1`,
          [mantenimiento.id_encargado]
        );

        const encargado = encargadoRows[0];

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: encargado.correo,
          subject: `Guayaba - Eliminación de Mantenimiento: ${mantenimiento.tipo}`,
          text: `El mantenimiento para el espacio ${espacio.nombre_espacio} en el edificio ${espacio.nombre_edificio}, sede ${espacio.nombre_sede} ha sido eliminado. 
                 Clasificación: ${espacio.clasificacion}
                 Detalle: ${mantenimiento.detalle}
                 Fecha de Asignación: ${new Date(mantenimiento.fecha_asignacion).toLocaleDateString()}
                 Fecha Ideal de Finalización: ${new Date(new Date(mantenimiento.fecha_asignacion).setDate(new Date(mantenimiento.fecha_asignacion).getDate() + mantenimiento.plazo_ideal)).toLocaleDateString()}
                 Eliminado por: ${eliminador.correo}
                 Puede ver más detalles en: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/espacios?idEdificio=${espacio.id_edificio}`
        };

        await Mail.sendAlertEmail(mailOptions);
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ message: "Mantenimiento eliminado exitosamente", mantenimiento });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error eliminando mantenimiento:", error.message);
      res.status(500).json({ error: "Error al eliminar mantenimiento." });
    }
  },

  verificarYEnviarAlertas: async () => {
    try {
      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el usuario en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = 'Automático'`);

      const { rows } = await pool.query(`
        SELECT m.*, p.correo AS encargado_correo, e.id_edificio, e.nombre AS nombre_espacio, ed.nombre AS nombre_edificio, s.nombre AS nombre_sede, e.clasificacion
        FROM guayaba.Mantenimiento m
        JOIN guayaba.Persona p ON m.id_encargado = p.id_persona
        JOIN guayaba.Espacio e ON m.id_espacio = e.id_espacio
        JOIN guayaba.Edificio ed ON e.id_edificio = ed.id_edificio
        JOIN guayaba.Sede s ON ed.id_sede = s.id_sede
        WHERE m.terminado = FALSE
        AND CURRENT_DATE > (m.fecha_asignacion + INTERVAL '1 day' * m.plazo_ideal)
      `);

      if (rows.length === 0) {
        console.log("No hay mantenimientos atrasados.");
        await pool.query('COMMIT'); // Confirmar transacción
        return;
      }

      for (const mantenimiento of rows) {
        const fechaInicio = new Date(mantenimiento.fecha_asignacion);
        const fechaFin = new Date(fechaInicio);
        fechaFin.setDate(fechaFin.getDate() + mantenimiento.plazo_ideal);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: mantenimiento.encargado_correo,
          subject: `Guayaba - Alerta de Mantenimiento Atrasado: ${mantenimiento.tipo}`,
          text: `El mantenimiento para el espacio ${mantenimiento.nombre_espacio} en el edificio ${mantenimiento.nombre_edificio}, sede ${mantenimiento.nombre_sede} está atrasado. Por favor, tome las acciones necesarias.
                 Clasificación: ${mantenimiento.clasificacion}
                 Detalle: ${mantenimiento.detalle}
                 Fecha de Asignación: ${fechaInicio.toLocaleDateString()}
                 Fecha Ideal de Finalización: ${fechaFin.toLocaleDateString()}
                 Puede ver más detalles en: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/espacios?idEdificio=${mantenimiento.id_edificio}`
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
      console.error("Error verificando y enviando alertas:", error.message);
    }
  },

  addMantenimientosManual: async (req, res) => {
    const { mantenimientos } = req.body; // Array de mantenimientos
  
    if (!Array.isArray(mantenimientos) || mantenimientos.length === 0) {
      return res.status(400).json({ error: "Debe proporcionar una lista de mantenimientos válida." });
    }
  
    try {
      await pool.query("BEGIN"); // Iniciar transacción
  
      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_email = '${req.user.correo}'`);
  
      const addedMantenimientos = [];
      for (const mantenimiento of mantenimientos) {
        const {
          id_espacio,
          id_encargado,
          tipo_contrato,
          tipo,
          estado,
          necesidad,
          prioridad,
          detalle,
          fecha_asignacion,
          plazo_ideal,
          terminado,
          observación
        } = mantenimiento;
  
        const result = await pool.query(
          `INSERT INTO guayaba.Mantenimiento
          (id_espacio, id_encargado, tipo_contrato, tipo, estado, necesidad, prioridad, detalle, fecha_asignacion, plazo_ideal, terminado, observación) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
          RETURNING *`,
          [
            id_espacio,
            id_encargado,
            tipo_contrato || 'interno',
            tipo,
            estado,
            necesidad || null,
            prioridad,
            detalle || null,
            fecha_asignacion || new Date().toISOString(),
            plazo_ideal,
            terminado || false,
            observación || null
          ]
        );
  
        addedMantenimientos.push(result.rows[0]);
      }
  
      await pool.query("COMMIT"); // Confirmar transacción
      res.status(200).json({
        message: "Mantenimientos añadidos exitosamente.",
        mantenimientos: addedMantenimientos,
      });
    } catch (error) {
      await pool.query("ROLLBACK"); // Revertir transacción en caso de error
      console.error("Error al añadir mantenimientos:", error.message);
      res.status(500).json({
        error: error.message || "Hubo un problema al añadir los mantenimientos.",
      });
    }
  },

  getByEspacios: async (req, res) => {
    const { ids_espacios } = req.body;
  
    if (!Array.isArray(ids_espacios) || ids_espacios.length === 0) {
      return res.status(400).json({ error: "Debe proporcionar una lista de IDs de espacios válida." });
    }
  
    try {
      const placeholders = ids_espacios.map((_, index) => `$${index + 1}`).join(', ');
      const query = `SELECT * FROM guayaba.Mantenimiento WHERE id_espacio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_espacios);
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo mantenimientos por espacios:", error.message);
      res.status(500).json({ error: "Error al obtener mantenimientos por espacios." });
    }
  },

};