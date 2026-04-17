import { Router } from 'express';
import * as friendshipController from '../controllers/friendship.controller';

const router = Router();

router.get('/allDate',friendshipController.getAll);
router.get('/getMyListFriendship/:id',friendshipController.getMyListFriendship);
router.get('/getMyListFriendship/:id/:nameUser',friendshipController.getMyListFriendship);
router.get('/:fId/getMutualFriends/:id', friendshipController.getMutualFriends);
router.get('/getMyRequest/:id',friendshipController.getMyRequest);
router.get('/getMyRequest/:id/:nameUser',friendshipController.getMyRequest);

router.patch('/updateStatus/:idf/:idu/:estado', friendshipController.updateStatus);

router.post('/addFriends/:eid', friendshipController.addFriends);


export default router;