import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const generateTestJWT = () => {
  return jwt.sign(
    {
      userId: 1,  // ID de prueba
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
}
