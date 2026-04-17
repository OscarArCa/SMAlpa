import { Router } from 'express';
import * as ServiceController from '../controllers/service.controller'

const router = Router();

router.get('/all', ServiceController.getAll);
router.get('/ServiceList/:nameService', ServiceController.ServiceList);
router.get('/ServiceList', ServiceController.ServiceList);
router.get('/getServiceById/:id', ServiceController.getServiceById);
router.get('/getServiceByUser/:id',ServiceController.getServiceByUser);
router.get('/getServiceByName/:id', ServiceController.getServiceByName);
router.get('/getServiceByName/:id/:nameService', ServiceController.getServiceByName);
router.get('/getServicePublicByFriends/:id/:nameService',ServiceController.getServicePublicByFriends);
router.get('/getServicePublicByFriends/:id',ServiceController.getServicePublicByFriends);
router.get('/getAffiliateByService/:id',ServiceController.getAffiliateByService);
router.get('/getNumServiceByUser/:id', ServiceController.getNumServiceByUser);
router.get('/getNumReportsByService/:id', ServiceController.getNumReportsByService);
router.get('/getNumAffiliateByService/:id', ServiceController.getNumAffiliateByService);
router.get('/getLogoCategori', ServiceController.getLogoCategori);
router.get('/getLogoSubCategori/:categoria', ServiceController.getLogoSubCategori);
router.get('/getLogoByCategories/:categoria/:subcategoria', ServiceController.getLogoByCategories);
router.get('/isRealicePay/:ids/:idu', ServiceController.isRealicePay);

router.post("/createService", ServiceController.createService);
router.post("/setAffiliate/:idService/:idUser", ServiceController.setAffiliate);
router.post("/generateVoucher/:eId/:rId/:sId", ServiceController.generateVoucher);

router.patch("/Suspender/:id/:validar", ServiceController.Suspender);
router.patch("/disaffiliate/:idService/:idUser",ServiceController.disaffiliate);

export default router;