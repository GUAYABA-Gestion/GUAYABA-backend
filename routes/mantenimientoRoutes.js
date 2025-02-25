import { Router } from "express";
import { Mantenimiento } from "../controllers/mantenimientoController.js";
import { jwtAuth, apiKeyAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Mantenimiento.getAll);
router.post("/by-espacios", jwtAuth, Mantenimiento.getByEspacios);
router.post("/create", jwtAuth, Mantenimiento.create);
router.put("/update-mantenimiento", jwtAuth, Mantenimiento.update); // Actualizar cualquier campo
router.delete("/delete/:id", jwtAuth, Mantenimiento.delete);
router.post("/addMantenimientosManual", jwtAuth, Mantenimiento.addMantenimientosManual);

router.post('/verificar-mantenimiento', apiKeyAuth, Mantenimiento.verificarYEnviarAlertas);

export default router;