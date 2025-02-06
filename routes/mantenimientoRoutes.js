import { Router } from "express";
import { Mantenimiento } from "../controllers/mantenimientoController.js"; // Importar el objeto Mantenimiento
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/getBy", jwtAuth,Mantenimiento.getById);
router.post("/create", jwtAuth, Mantenimiento.create);
router.put("/update", jwtAuth, Mantenimiento.updateEstado);
router.put("/delete", jwtAuth, Mantenimiento.delete);

router.get("/ping",jwtAuth,Mantenimiento.pingtest);

export default router;