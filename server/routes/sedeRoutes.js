import { Router } from "express";
import { Sede } from "../controllers/sedeController.js";
import {
  jwtAuth,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", Sede.getSedes);
router.get("/sedes", jwtAuth, Sede.getSedes);
router.get("/:id", jwtAuth, Sede.getSedeById);
router.post("/create-sede", jwtAuth, Sede.createSede);
router.put("/update-sede", jwtAuth, Sede.updateSede);
router.post("/addSedesManual", jwtAuth, Sede.addSedesManual);
router.delete("/delete/:id", jwtAuth, Sede.deleteSede);

export default router;
