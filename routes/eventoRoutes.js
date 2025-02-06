import { Router } from "express";
import { Evento } from "../controllers/eventoController.js"; // Importar el objeto evento
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();
try{
router.get("/getAll", jwtAuth, Evento.getAll);
router.post("/getBy", jwtAuth, Evento.getBy);
router.post("/create", jwtAuth, Evento.create);
router.put("/update", jwtAuth, Evento.  update);
router.put("/delete", jwtAuth, Evento.delete);
}
catch(error){
    console.log(error);
}
export default router;