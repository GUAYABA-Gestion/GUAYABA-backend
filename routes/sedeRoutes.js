import { Router } from "express";
import { Sede } from "../controllers/sedeController.js";
import { jwtAuth, validateGoogleTokenFromGet } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", validateGoogleTokenFromGet, Sede.getSedes);
router.get("/:id", jwtAuth, Sede.getSedeById);

export default router;