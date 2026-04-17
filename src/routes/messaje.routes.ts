import { Router } from "express";
import * as messageController from '../controllers/message.controller'

const router = Router();

router.get('/:fId/getChat/:id',messageController.getChat);
router.post('/setMessage/mensaje/:idu/:idf',messageController.setMessage);

export default router;