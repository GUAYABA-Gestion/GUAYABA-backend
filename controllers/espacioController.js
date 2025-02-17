import { pool } from "../db.js";
import jwt from "jsonwebtoken"; // falta implementacion de jwt en reqs

export const Espacio = {
  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM guayaba.Espacio');
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo espacios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getBySede: async (req, res) => {
    const {id_sede} = req.body

    try {
      const { rows } = await pool.query(
        `SELECT e.*
        FROM guayaba.Espacio e
        INNER JOIN guayaba.Edificio b ON e.edificio_id = b.id_edificio
        WHERE b.id_sede = $1`, [id_sede]);
    } catch (error) {
      console.error("Error en consulta filtrada:", error);
      res.status(500).json({
          success: false,
          error: "Error al buscar espacios",
          details: error.message
      });
   }
},

  getBy: async (req, res) => {
    try {
        const validFilters = ['id_espacio', 'id_edificio', 'tipo', 'estado', 'Facultad'];
        
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
            `SELECT * FROM guayaba.Espacio WHERE ${whereClauses}`,
            Object.values(filters)
        );

        res.status(rows.length ? 200 : 404).json( rows);
        
    } catch (error) {
        console.error("Error en consulta filtrada:", error);
        res.status(500).json({
            success: false,
            error: "Error al buscar espacios",
            details: error.message
        });
    }
},

  create: async (req, res) => {
    try {
      const requiredFields = ["id_edificio", "nombre", "estado", "clasificacion", "uso", "tipo", "piso", "capacidad", "mediciónmt2"];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      //falta verificacion de FK en los parametros
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO guayaba.Espacio
        (id_edificio, nombre, estado, clasificacion, uso, tipo, piso, capacidad, mediciónmt2) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          req.body.id_edificio,
          req.body.nombre || null,
          req.body.estado || null,
          req.body.clasificacion || null,
          req.body.uso || null ,
          req.body.tipo || null,
          req.body.piso || null ,
          req.body.capacidad || null,
          req.body.mediciónmt2 || null
        ]
      );

      res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error creando espacio:", error);
      res.status(500).json({ success: false, error: "Error al crear espacio" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.body;
      const allowedFields = ['nombre', 'estado', 'tipo', 'capacidad', 'mediciónmt2'];
      const updates = Object.keys(req.body)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, error: "No se proporcionaron campos válidos para actualizar" });
      }

      const setClauses = Object.keys(updates)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(', ');

      const { rows } = await pool.query(
        `UPDATE guayaba.Espacio
        SET ${setClauses} 
        WHERE id_espacio = $${Object.keys(updates).length + 1} 
        RETURNING *`,
        [...Object.values(updates), id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Espacio no encontrado" });
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error actualizando espacio:", error);
      res.status(500).json({ success: false, error: "Error al actualizar espacio" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.body;
      const { rows } = await pool.query(
        'DELETE FROM guayaba.Espacio WHERE id_espacio = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Espacio no encontrado" });
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error eliminando espacio:", error);
      res.status(500).json({ success: false, error: "Error al eliminar espacio" });
    }
  }
};