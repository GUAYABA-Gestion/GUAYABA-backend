import { pool } from "../db.js";
import jwt from "jsonwebtoken";

export const Sede = {
  getSedes: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id_sede, nombre FROM guayaba.Sede`
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
        `SELECT id_sede, nombre, municipio, coordinador 
         FROM guayaba.Sede 
         WHERE id_sede = $1`,
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
  }
};