import { Router } from "express";
import { Espacio } from "../controllers/espacioController.js"; // Importar el objeto espacio
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/getAll", jwtAuth, Espacio.getAll);
router.get("/getBySede", jwtAuth, Espacio.getBySede);
router.post("/getBy", jwtAuth, Espacio.getBy);
router.post("/create", jwtAuth, Espacio.create);
router.put("/update", jwtAuth, Espacio.update);
router.post("/addEspaciosManual", jwtAuth, Espacio.addEspaciosManual);
router.put("/delete/:id", jwtAuth, Espacio.delete);

export default router;