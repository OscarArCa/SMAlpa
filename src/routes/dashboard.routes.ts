import { Router } from 'express';
import * as DashboardController from './../controllers/dashboard.controller';

const router = Router();

router.get('/getDashboardAdmin', DashboardController.getDashboardAdmin);
router.get('/getDashboardUser/:id', DashboardController.getDashboardUser);

export default router;