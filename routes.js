import { Router } from "express";
import userRoutes from "./routes/userRoutes.js";
import sedeRoutes from "./routes/sedeRoutes.js";
import espacioRoutes from "./routes/espacioRoutes.js";
import mantenimientoRoutes from "./routes/mantenimientoRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";
import edificioRoutes from "./routes/edificioRoutes.js"
import auditRoutes from "./routes/auditRoutes.js"
import alertaRoutes from "./routes/alertaRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import utilsRoutes from "./routes/utilsRoutes.js";

const router = Router();

// Ruta raíz
router.get("/", (req, res) => res.send(`
  <h1>Guayaba Backend</h1>
  <p><a href="/api/utils/ping">Ping database</a></p>
`));

// Montar rutas específicas
router.use("/user", userRoutes);
router.use("/sedes", sedeRoutes);
router.use("/espacios", espacioRoutes);
router.use("/mantenimientos", mantenimientoRoutes);
router.use("/edificios", edificioRoutes);
router.use("/auditoria", auditRoutes);
router.use("/eventos", eventoRoutes);
router.use("/alerta", alertaRoutes);
router.use("/contact", contactRoutes);
router.use("/utils", utilsRoutes);

export default router;