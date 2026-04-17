import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = Router();

router.get('/all',UserController.getAll);
router.get('/listUsers/:id',UserController.UsersList);
router.get('/listUsers/:id/:nameUser',UserController.UsersList);
router.get('/getFriendById/:id',UserController.getFriendById);
router.get('/getByIdHeader/:id', UserController.getByIdHeader);
router.get('/getUserById/:id', UserController.getUserById);
router.get('/getServiceByUser/:id', UserController.getServiceByUser);
router.get('/:fId/getSharedServices/:id', UserController.getSharedServices);
router.get('/getNumServiceByUserId/:id', UserController.getNumServiceByUserId);
router.get('/getServiceAfiliateByUser/:id', UserController.getServiceAfiliateByUser);

router.patch('/estatusUser/:id/:estado', UserController.estatusUser);

export default router;