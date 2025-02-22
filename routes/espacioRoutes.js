import { Router } from "express";
import { Espacio } from "../controllers/espacioController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/by-edificios", jwtAuth, Espacio.getByEdificios);
router.get("/:id", jwtAuth, Espacio.getById);
router.post("/create-espacio", jwtAuth, Espacio.createEspacio);
router.put("/update-espacio", jwtAuth, Espacio.updateEspacio);
router.post("/addEspaciosManual", jwtAuth, Espacio.addEspaciosManual);
router.delete("/delete/:id", jwtAuth, Espacio.deleteEspacio);

export default router;