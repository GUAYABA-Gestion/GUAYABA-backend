import { pool } from "../db.js";
import jwt from "jsonwebtoken"; // falta implementacion de jwt en reqs


export const Mantenimiento = {


  pingtest: async(req,res) => {
        try {
          const result = await pool.query("SELECT NOW()");
          res.json(result.rows[0]);
        } catch (error) {
          console.error("Error en /ping:", error.message);
          res.status(500).json({ error: "Error al consultar la base de datos" });
        }
      },
      
  create: async (req, res) => {
    try {
      const requiredFields = ['id_espacio', 'id_encargado', 'Estado', 'tipo', 'Prioridad'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
        });
      }

      const { rows } = await pool.query(
        //falta validacion de FK
        `INSERT INTO guayaba.Mantenimiento
        (id_espacio, id_encargado, tipo_contrato, tipo, estado, necesidad, prioridad, detalle, fecha_ini, fecha_fin, observación) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
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
          req.body.fecha_ini || new Date().toISOString(),
          req.body.fecha_fin || null,
          req.body.observación || null
        ]
      );

      res.status(201).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error creando mantenimiento:", error);
      res.status(500).json({ success: false, error: "Error al crear mantenimiento" });
    }
  },

  getAll: async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM guayaba.Mantenimiento');
      res.status(200).json({ success: true, data: rows });
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
      
      res.status(200).json({ success: true, data: rows });
      //res.status(200).json(rows);
    } catch (error) {
      console.error("Error obteniendo mantenimientos:", error);
      res.status(500).json({ success: false, error: "Error al obtener historial de mantenimiento" });
    }
  },

  updateEstado: async (req, res) => {
    try {
      const { id } = req.body;
      const { nuevoEstado } = req.body;

      if (!nuevoEstado) {
        return res.status(400).json({ 
          success: false, 
          error: "Se requiere el campo 'nuevoEstado'" 
        });
      }

      const { rows } = await pool.query(
        `UPDATE guayaba.Mantenimiento 
        SET Estado = $1, fecha_fin = $2 
        WHERE id_mantenimiento = $3 
        RETURNING *`,
        [nuevoEstado, nuevoEstado === 'Completo' ? new Date() : null, id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Registro de mantenimiento no encontrado" });
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error actualizando estado:", error);
      res.status(500).json({ success: false, error: "Error al actualizar estado de mantenimiento" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.body;
      const { rows } = await pool.query(
        'DELETE FROM guayaba.Mantenimiento WHERE id_mantenimiento = $1 RETURNING *',
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Registro de mantenimiento no encontrado" });
      }

      res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
      console.error("Error eliminando mantenimiento:", error);
      res.status(500).json({ success: false, error: "Error al eliminar registro de mantenimiento" });
    }
  }
};