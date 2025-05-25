import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const generateTestJWT = () => {
  return jwt.sign(
    {
      id_persona: 1,  // ID de prueba
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // 1 día de duración
  );
};

export const getMunicipios = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, nombre FROM guayaba.Municipio`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener municipios:", error);
    res.status(500).json({ error: "Error al obtener municipios" });
  }
};

export const getProgramasConFacultad = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_programa, 
        p.nombre AS programa_nombre, 
        p.nivel, 
        f.id_facultad, 
        f.nombre AS facultad_nombre
      FROM 
        guayaba.Programa p
      JOIN 
        guayaba.Facultad f ON p.id_facultad = f.id_facultad
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener programas con facultad:", error);
    res.status(500).json({ error: "Error al obtener programas con facultad" });
  }
};