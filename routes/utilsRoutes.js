import { Router } from "express";
import { pool } from "../db.js";
import { generateTestJWT, getMunicipios, getProgramasConFacultad } from "../controllers/utilsController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

export const Test = {
  generateTestToken: (req, res) => {
    const token = generateTestJWT();
    res.json({ token });
  }
};

const router = Router();

// Ruta para generar un token de prueba
router.get("/generate-test-token", Test.generateTestToken);

// Ruta /ping
router.get("/ping", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en /ping:", error.message);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

// Municipios y programas
router.get("/municipios", jwtAuth, getMunicipios);
router.get("/programas", jwtAuth, getProgramasConFacultad);

export default router;
