import { Router } from "express";
import { registerUser, loginWithGoogle, googleCallback, logout } from "../controllers/authController.js";

const router = Router();

// Registro de usuario desde el flujo de Google
router.post("/register", registerUser);

// Login y callback de Google
router.get("/google", loginWithGoogle);
router.get("/google/callback", googleCallback);

// Logout
router.get("/logout", logout);

export default router;
