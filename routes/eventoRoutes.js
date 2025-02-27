import { Router } from "express";
import { Evento } from "../controllers/eventoController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/by-espacios", jwtAuth, Evento.getByEspacios);
router.post("/addEventosManual", jwtAuth, Evento.addEventosManual); // Añadir eventos manualmente
router.put("/update/:id", jwtAuth, Evento.update); // Actualizar evento
router.delete("/delete/:id", jwtAuth, Evento.delete); // Eliminar evento

export default router;