import { Router } from "express";
import { Mantenimiento } from "../controllers/mantenimientoController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Mantenimiento.getAll);
router.post("/by-espacios", jwtAuth, Mantenimiento.getByEspacios);
router.post("/create", jwtAuth, Mantenimiento.create);
router.put("/update-estado", jwtAuth, Mantenimiento.updateEstado);
router.delete("/delete", jwtAuth, Mantenimiento.delete);

export default router;