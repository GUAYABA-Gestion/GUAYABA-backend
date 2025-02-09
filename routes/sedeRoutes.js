import { Router } from "express";
import { Sede } from "../controllers/sedeController.js";
import {
  jwtAuth,
  validateGoogleTokenFromGet,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", jwtAuth, Sede.getSedes);
router.get("/:id", jwtAuth, Sede.getSedeById);
router.post("/create-sede", jwtAuth, Sede.createSede);
router.post("/update-sede", jwtAuth, Sede.updateSede);

export default router;
