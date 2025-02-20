import { Router } from "express";
import { Espacio } from "../controllers/espacioController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Espacio.getAll);
router.post("/by-sede", jwtAuth, Espacio.getBySede);
router.post("/by-edificios", jwtAuth, Espacio.getByEdificios);
router.post("/create", jwtAuth, Espacio.create);
router.put("/update", jwtAuth, Espacio.update);
router.post("/addEspaciosManual", jwtAuth, Espacio.addEspaciosManual);
router.delete("/delete", jwtAuth, Espacio.delete);

export default router;