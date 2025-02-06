import { Router } from "express";
import { Evento } from "../controllers/eventoController.js"; // Importar el objeto evento
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/getAll", jwtAuth, Espacio.getAll);
router.post("/getBy", jwtAuth, Espacio.getBy);
router.post("/create", jwtAuth, Espacio.create);
router.put("/update", jwtAuth, Espacio.update);
router.put("/delete", jwtAuth, Espacio.delete);

export default router;