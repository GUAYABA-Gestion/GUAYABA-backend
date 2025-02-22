import { Router } from "express";
import { Edificio } from "../controllers/edificioController.js";
import { jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Edificio.getEdificios);
router.get("/:id", jwtAuth, Edificio.getEdificioById);
router.post("/create-edificio", jwtAuth, Edificio.createEdificio);
router.put("/update-edificio", jwtAuth, Edificio.updateEdificio);
router.post("/addEdificiosManual", jwtAuth, Edificio.addEdificiosManual);
router.delete("/delete/:id", jwtAuth, Edificio.deleteEdificio);

export default router;