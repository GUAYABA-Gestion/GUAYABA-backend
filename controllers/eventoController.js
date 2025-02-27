import { pool } from "../db.js";

export const Evento = {
  getByEspacios: async (req, res) => {
    const { ids_espacios } = req.body;
  
    if (!Array.isArray(ids_espacios) || ids_espacios.length === 0) {
      return res.status(400).json({ error: "Debe proporcionar una lista de IDs de espacios válida." });
    }
  
    try {
      const placeholders = ids_espacios.map((_, index) => `$${index + 1}`).join(', ');
      const query = `SELECT * FROM guayaba.Evento WHERE id_espacio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_espacios);
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo eventos por espacios:", error.message);
      res.status(500).json({ error: "Error al obtener eventos por espacios." });
    }
  },

  addEventosManual: async (req, res) => {
    const { eventos } = req.body;
  
    if (!Array.isArray(eventos) || eventos.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Debe proporcionar una lista de eventos válida."
      });
    }
  
    try {
      await pool.query('BEGIN');
  
      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);
  
      const addedEventos = [];
      for (const evento of eventos) {
        const { rows } = await pool.query(
          `INSERT INTO guayaba.Evento (id_espacio, tipo, nombre, descripción, id_programa, fecha_inicio, fecha_fin, hora_inicio, hora_fin, días) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           RETURNING *`,
          [
            evento.id_espacio,
            evento.tipo || null,
            evento.nombre || null,
            evento.descripcion || null,
            evento.id_programa,
            evento.fecha_inicio,
            evento.fecha_fin,
            evento.hora_inicio,
            evento.hora_fin,
            evento.días
          ]
        );
        addedEventos.push(rows[0]);
      }
  
      await pool.query('COMMIT');
      res.status(200).json({ success: true, data: addedEventos });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error("Error añadiendo eventos:", error);
      res.status(500).json({ success: false, error: "Error al añadir eventos" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const allowedFields = ['tipo', 'nombre', 'descripción', 'id_espacio', 'id_programa', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'días'];
      const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});
  
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, error: "No se proporcionaron campos válidos para actualizar" });
      }
  
      await pool.query('BEGIN');
  
      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);
  
      const setClauses = Object.keys(updates)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');
  
      const { rows } = await pool.query(
        `UPDATE guayaba.Evento
         SET ${setClauses} 
         WHERE id_evento = $${Object.keys(updates).length + 1} 
         RETURNING *`,
        [...Object.values(updates), id]
      );
  
      if (rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ success: false, error: "Evento no encontrado" });
      }
  
      await pool.query('COMMIT');
      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error("Error actualizando evento:", error);
      res.status(500).json({ success: false, error: "Error al actualizar evento" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
  
      await pool.query('BEGIN');
  
      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);
  
      const { rows } = await pool.query(
        'DELETE FROM guayaba.Evento WHERE id_evento = $1 RETURNING *',
        [id]
      );
  
      if (rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ success: false, error: "Evento no encontrado" });
      }
  
      await pool.query('COMMIT');
      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error("Error eliminando evento:", error);
      res.status(500).json({ success: false, error: "Error al eliminar evento" });
    }
  },
};