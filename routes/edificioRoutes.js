import { Router } from "express";
import { Edificio } from "../controllers/edificioController.js";
import {
  jwtAuth,
  validateGoogleTokenFromGet,
} from "../middlewares/authMiddleware.js";

const router = Router();

// router.get("/", validateGoogleTokenFromGet, Sede.getSedes);
// router.get("/:id", jwtAuth, Sede.getSedeById);
// router.post("/create-sede", jwtAuth, Sede.createSede);
// router.post("/update-sede", jwtAuth, Sede.updateSede);

router.post('/create-edificio', jwtAuth, Edificio.createEdificio);

router.get('/', jwtAuth, Edificio.getEdificios);

export default router;
