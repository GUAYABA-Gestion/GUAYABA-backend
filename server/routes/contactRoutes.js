import {Router} from "express";
import { Contact } from "../controllers/contactController.js";

const router = Router();

router.post("/", Contact.sendContactEmail);

export default router;