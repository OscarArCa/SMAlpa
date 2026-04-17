import { Router } from "express";
import * as ProfileController from './../controllers/profile.controller'
import { uploadFoto } from "../middleware/upload.middleware"; // <--- Importa el middleware que creamos

const router = Router();

router.put("/users/photo/:id", uploadFoto, ProfileController.setPhoto);
router.put("/editData/:id", ProfileController.editData);
router.put("/editLocation/:id", ProfileController.editLocation);
router.put("/editLocation", ProfileController.editLocation);

router.get("/getCountry",ProfileController.getCountry);
router.get("/getRegion/:id",ProfileController.getRegion);
router.get("/getProvincia/:id",ProfileController.getProvincia);
router.get("/getDistrito/:id",ProfileController.getDistrito);



export default router;