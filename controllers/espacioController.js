import { pool } from "../db.js";
import jwt from "jsonwebtoken"; // falta implementacion de jwt en reqs

export const Espacio = {
  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM "Espacio"');
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error obteniendo espacios:", error);
      res.status(500).json({ success: false, error: "Error interno del servidor" });
    }
  },

  getBy: async (req, res) => {
    try {
      const validFilters = ['id_espacio', 'id_edificio', 'Tipo', 'estado', 'Facultad'];
      const filters = Object.keys(req.query)
        .filter(key => validFilters.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.query[key];
          return obj;
        }, {});

      if (Object.keys(filters).length === 0) {
        return res.status(400).json({ success: false, error: "Filtros no válidos" });
      }

      const whereClauses = Object.keys(filters)
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(' AND ');

      const { rows } = await pool.query(
        `SELECT * FROM "Espacio" WHERE ${whereClauses}`,
        Object.values(filters)
      );

      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error en consulta filtrada:", error);
      res.status(500).json({ success: false, error: "Error al buscar espacios" });
    }
  },

  create: async (req, res) => {
    try {
      const requiredFields = ['id_edificio', 'nombre', 'estado', 'Tipo', 'capacidad'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      //falta verificacion de FK en los parametros
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        });
      }

      const { rows } = await pool.query(
        `INSERT INTO "Espacio" 
        (id_edificio, nombre, estado, Tipo, capacidad, mediciónmt2, Descripción) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
        [
          req.body.id_edificio,
          req.body.nombre,
          req.body.estado,
          req.body.Tipo,
          req.body.capacidad,
          req.body.mediciónmt2 || null,
          req.body.Descripción || null
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
      const { id } = req.params;
      const allowedFields = ['nombre', 'estado', 'Tipo', 'capacidad', 'mediciónmt2', 'Descripción'];
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
        `UPDATE "Espacio" 
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
      const { id } = req.params;
      const { rows } = await pool.query(
        'DELETE FROM "Espacio" WHERE id_espacio = $1 RETURNING *',
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