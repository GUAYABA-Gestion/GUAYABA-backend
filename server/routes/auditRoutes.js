import { Router } from "express";
import { Audit } from "../controllers/auditController.js";
import {
  jwtAuth,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/audit", jwtAuth, Audit.getAuditoria);
// router.get("/:id", jwtAuth, Sede.getSedeById);
// router.post("/create-sede", jwtAuth, Sede.createSede);
// router.post("/update-sede", jwtAuth, Sede.updateSede);

export default router;
