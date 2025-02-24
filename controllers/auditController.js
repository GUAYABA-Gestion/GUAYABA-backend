import { pool } from "../db.js";
import jwt from "jsonwebtoken";

// Exportar un objeto con todas las funciones del controlador
export const Audit = {
  getAuditoria: async (req, res) => {
    try {
      const result = await pool.query(`
            SELECT *  
            FROM guayaba.Auditoria
            ORDER BY fecha_hora desc;
          `);
      res.json(result.rows);
    } catch (error) {
      console.error("Error al obtener historial:", error.message);
      res.status(500).json({ error: "Error al obtener el historial" });
    }
  },
};
