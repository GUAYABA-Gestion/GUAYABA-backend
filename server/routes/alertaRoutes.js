import { Router } from "express";
import { Alerta } from "../controllers/alertaController.js";
import {
  jwtAuth,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/send", jwtAuth, Alerta.mailSend);


export default router;