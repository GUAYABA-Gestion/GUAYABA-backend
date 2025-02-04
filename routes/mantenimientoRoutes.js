import { Router } from "express";
import { Mantenimiento } from "../controllers/mantenimientoController.js"; // Importar el objeto Mantenimiento
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/getMantenimiento", jwtAuth, Mantenimiento.getById);
router.post("/create", jwtAuth, Mantenimiento.create);
router.put("/update", jwtAuth, Mantenimiento.updateEstado);
router.delete("/delete", jwtAuth, Mantenimiento.delete);

export default router;