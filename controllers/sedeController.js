import { pool } from "../db.js";
import jwt from "jsonwebtoken";

export const Sede = {
  getSedes: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT s.id_sede, s.nombre, s.municipio, s.coordinador, 
              m.nombre AS nombre_municipio, p.nombre AS nombre_coordinador
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
      const checkResult = await pool.query(
        `SELECT * FROM guayaba.Sede WHERE nombre = $1`,
        [nombre]
      );

      if (checkResult.rowCount > 0) {
        return res.json({
          message: "La sede ya está registrada.",
          registered: true,
        });
      }

      const sedeResult = await pool.query(
        `INSERT INTO guayaba.Sede (nombre, municipio, coordinador) VALUES ($1,
        $2, $3, $4, NULL, NULL) RETURNING id_persona`,
        [nombre, municipio, coordinador]
      );

      if (sedeResult.rowCount === 0) {
        throw new Error("No se pudo crear la sede.");
      }

      return res.json({ message: "Sede creada con éxito.", registered: true });
    } catch (err) {
      console.error("Error al crear la sede:", err.message);
      res.status(500).json({ error: "Error al crear la sede." });
    }
  },

  updateSede: async (req, res) => {
    const { id_sede, nombre, municipio, coordinador } = req.body;

    try {
      const updateSedeQuery = `
      UPDATE guayaba.Sede
      SET nombre = $2, municipio = $3, coordinador = $4
      WHERE id_sede = $1;
      `;

      const values = [id_sede, nombre, municipio, coordinador];
      await pool.query(updateSedeQuery, values);

      res.status(200).json({ message: "Sede actualizada exitosamente" });
    } catch (error) {
      console.error("Error al actualizar la sede:", error.message);
      res
        .status(500)
        .json({ error: "Hubo un problema al actualizar la sede." });
    }
  },
};
