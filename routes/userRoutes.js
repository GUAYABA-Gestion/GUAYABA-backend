import { Router } from "express";
import { User } from "../controllers/userController.js"; // Importar el objeto User
import { validateGoogleToken, dynamicGoogleValidation, jwtAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/check-user", dynamicGoogleValidation, User.checkUser);
router.post("/register", validateGoogleToken, User.registerUser);
router.post("/getById", jwtAuth, User.getUserDataById);
router.get("/getAll", jwtAuth, User.getUsersData);
router.get("/me", jwtAuth, User.getUserData);
router.put("/update", jwtAuth, User.updateUser);
router.delete("/delete", jwtAuth, User.deleteUser);
router.post("/addUser", jwtAuth,User.addUsersManual);
router.delete("/deleteManual", jwtAuth, User.deleteUserManual);
router.post("/references", jwtAuth, User.getUserReferences);

export default router;