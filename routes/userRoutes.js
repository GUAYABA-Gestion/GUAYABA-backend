import { Router } from "express";
import { User } from "../controllers/userController.js"; // Importar el objeto User
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/check-user", dynamicGoogleValidation, User.checkUser);
router.post("/register", validateGoogleToken, User.registerUser);
router.get("/me", jwtAuth, User.getUserData);
router.delete("/delete", jwtAuth, User.deleteUser);

export default router;