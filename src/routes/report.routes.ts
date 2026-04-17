import { Router } from 'express';
import * as ReportController from '../controllers/report.controller'

const router = Router();

router.get('/all', ReportController.getAll);
router.get('/getReportList', ReportController.getReportList);
router.get('/getReportList/:nameUser', ReportController.getReportList);
router.get('/getReportById/:id', ReportController.getReportById);
router.get('/getNumReportsByUser/:id', ReportController.getNumReportsByUser);
router.get('/resuelto/:id', ReportController.resuelto);

router.post('/setReportUser/:emisor/:receptor', ReportController.setReportUser);
router.post('/setReportService/:emisor/:receptor/:servicio', ReportController.setReportService);

export default router;