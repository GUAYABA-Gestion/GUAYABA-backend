import { Router } from "express";
import { User } from "../controllers/userController.js"; // Importar el objeto User
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/check-user", dynamicGoogleValidation, User.checkUser);
router.post("/register", validateGoogleToken, User.registerUser);
router.get("/getAll", jwtAuth, User.getUsersData);
router.get("/me", jwtAuth, User.getUserData);
router.put("/update", jwtAuth, User.updateUser);
router.delete("/delete", jwtAuth, User.deleteUser);
router.post("/addUser", jwtAuth,User.addUsersManual);
router.delete("/deleteManual", jwtAuth, User.deleteUserManual);
router.post("/references", jwtAuth, User.getUserReferences);
router.get("/getAdmins", jwtAuth, User.getAdmins);
router.get("/getMaints", jwtAuth, User.getMaints);

export default router;