import { Router } from "express";
import userRoutes from "./userRoutes.js";
import sedeRoutes from "./sedeRoutes.js";
import { pool } from "../db.js";

const router = Router();

// Ruta raíz
router.get("/", (req, res) => res.send("¡Hola Mundo!"));

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

export default router;