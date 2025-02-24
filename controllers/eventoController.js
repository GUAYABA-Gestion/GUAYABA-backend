import { pool } from "../db.js";
import jwt from "jsonwebtoken"; // falta implementacion de jwt en reqs

export const Evento = {

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
      const query = `SELECT * FROM guayaba.Evento WHERE id_espacio IN (${placeholders})`;
      const { rows } = await pool.query(query, ids_espacios);
  
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo eventos por espacios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM guayaba.Evento');
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getBy: async (req, res) => {
    try {
        const validFilters = ['id_evento','nombre','id_espacio', 'id_programa', 'tipo', 'dias'];
        
        // Combinar query y body
        const requestData = { ...req.query, ...req.body };
        
        const filters = Object.keys(requestData)
            .filter(key => validFilters.includes(key) && requestData[key] !== undefined)
            .reduce((obj, key) => {
                obj[key] = typeof requestData[key] === 'string' 
                         ? requestData[key].trim() 
                         : requestData[key];
                return obj;
            }, {});

        if (!Object.keys(filters).length) {
            return res.status(400).json({
                success: false,
                error: "Debe proporcionar al menos un filtro válido",
                validFilters: validFilters
            });
        }

        const whereClauses = Object.keys(filters)
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(' AND ');

        const { rows } = await pool.query(
            `SELECT * FROM guayaba.Evento WHERE ${whereClauses}`,
            Object.values(filters)
        );

        res.status(rows.length ? 200 : 404).json({
            success: true,
            count: rows.length,
            data: rows
        });
        
    } catch (error) {
        console.error("Error en consulta filtrada:", error);
        res.status(500).json({
            success: false,
            error: "Error al buscar eventos",
            details: error.message
        });
    }
},

  create: async (req, res) => {
    try {
      const requiredFields = ['id_espacio', 'id_programa', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'días'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      //falta verificacion de FK en los parametros
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
        `INSERT INTO guayaba.Evento (id_espacio, tipo, nombre, descripción, id_programa, fecha_inicio, fecha_fin, hora_inicio, hora_fin, días) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *`,
        [ //para fecha fin y tiempo fin se debe igualmente pasar algo distinto a now, por ahora es parte del testing
          req.body.id_espacio,
          req.body.tipo || null ,
          req.body.nombre || null ,
          req.body.descripcion || null ,
          req.body.id_programa,
          req.body.fecha_inicio || new Date().toISOString(),
          req.body.fecha_fin || new Date().toISOString(),
          req.body.hora_inicio || new Date().getTime(),
          req.body.hora_fin || new Date().getTime(),
          req.body.días || null
        ]
      );

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error creando evento:", error);
      res.status(500).json({ success: false, error: "Error al crear evento" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.body;
      const allowedFields = ['tipo', 'nombre', 'descripción','id_espacio', 'id_programa', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'días'];      
      const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, error: "No se proporcionaron campos válidos para actualizar" });
      }

      await pool.query('BEGIN'); // Iniciar transacción

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
        await pool.query('ROLLBACK'); // Revertir transacción
        return res.status(404).json({ success: false, error: "Espacio no encontrado" });
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error actualizando espacio:", error);
      res.status(500).json({ success: false, error: "Error al actualizar espacio" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.body;

      await pool.query('BEGIN'); // Iniciar transacción

      // Establecer el id_persona en la sesión de la base de datos
      await pool.query(`SET LOCAL app.current_user_id = '${req.user.id_persona}'`);

      const { rows } = await pool.query(
        'DELETE FROM guayaba.Evento WHERE id_evento = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        await pool.query('ROLLBACK'); // Revertir transacción
        return res.status(404).json({ success: false, error: "Evento no encontrado" });
      }

      await pool.query('COMMIT'); // Confirmar transacción

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      await pool.query('ROLLBACK'); // Revertir transacción en caso de error
      console.error("Error eliminando evento:", error);
      res.status(500).json({ success: false, error: "Error al eliminar evento" });
    }
  }
};