import { Router } from "express";
import { User } from "../controllers/userController.js";
import { requireRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// --- Rutas legacy (comentadas, para referencia y migración a GraphQL) ---
// router.post("/check-user", dynamicGoogleValidation, User.checkUser);
// router.get("/getAll", jwtAuth, User.getUsersData);
// router.get("/me", jwtAuth, User.getUserData);
// router.get("/getAdmins", jwtAuth, User.getAdmins);
// router.get("/getMaints", jwtAuth, User.getMaints);

// --- Rutas activas ---

router.get("/me", User.getUserData);

router.put("/update", User.updateUser);
router.delete("/delete", User.deleteUser);
router.post("/addUser", User.addUsersManual);
router.delete("/deleteManual", User.deleteUserManual);
router.post("/references", User.getUserReferences);

export default router;