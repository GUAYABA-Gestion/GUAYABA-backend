import { Router } from "express";
import userRoutes from "./userRoutes.js";
import sedeRoutes from "./sedeRoutes.js";
import espacioRoutes from "./espacioRoutes.js";
import mantenimientoRoutes from "./mantenimientoRoutes.js";
import eventoRoutes from "./eventoRoutes.js";
import edificioRoutes from "./edificioRoutes.js"
import auditRoutes from "./auditRoutes.js"
import alertaRoutes from "./alertaRoutes.js"
import { getMunicipios } from "../controllers/utilsController.js";
import { pool } from "../db.js";

import { generateTestJWT } from "../controllers/utilsController.js"; // Importa la función
import { jwtAuth } from "../middlewares/authMiddleware.js";

export const Test = {
  generateTestToken: (req, res) => {
    const token = generateTestJWT();
    res.json({ token });
  }
};

const router = Router();

// Ruta raíz
router.get("/", (req, res) => res.send("¡Hola Mundo!"));

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

// Montar rutas específicas
router.use("/user", userRoutes);
router.use("/sedes", sedeRoutes);
//WIP
router.use("/espacio", espacioRoutes);
router.use("/mantenimiento", mantenimientoRoutes);
router.use("/edificios", edificioRoutes);
router.use("/auditoria", auditRoutes)
router.use("/evento",eventoRoutes);
router.use("/alerta",alertaRoutes);
router.get("/municipios", jwtAuth, getMunicipios);

export default router;