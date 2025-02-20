import { Router } from "express";
import { Evento } from "../controllers/eventoController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Evento.getAll);
router.post("/by-espacios", jwtAuth, Evento.getByEspacios);
router.post("/create", jwtAuth, Evento.create);
router.put("/update", jwtAuth, Evento.update);
router.delete("/delete", jwtAuth, Evento.delete);

export default router;