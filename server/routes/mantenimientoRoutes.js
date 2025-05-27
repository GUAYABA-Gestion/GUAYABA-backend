import { Router } from "express";
import { Mantenimiento } from "../controllers/mantenimientoController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Mantenimiento.getAll);
router.post("/by-espacios", jwtAuth, Mantenimiento.getByEspacios);
router.put("/update-mantenimiento", jwtAuth, Mantenimiento.update); // Actualizar cualquier campo
router.delete("/delete/:id", jwtAuth, Mantenimiento.delete);
router.post("/addMantenimientosManual", jwtAuth, Mantenimiento.addMantenimientosManual);

router.post('/verificar-mantenimiento', Mantenimiento.verificarYEnviarAlertas);

export default router;