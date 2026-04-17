import { Router } from 'express';
import * as VoucherController from '../controllers/voucher.controller'

const router = Router();

router.get('/all', VoucherController.getAll);
router.get('/getVoucherList', VoucherController.getVoucherList);
router.get('/getVoucherList/:nameVoucher', VoucherController.getVoucherList);
router.get('/getVoucherListByUser/:id', VoucherController.getVoucherListByUser);
router.get('/getVoucherListByUser/:id/:nameVoucher', VoucherController.getVoucherListByUser);
router.get('/getVoucherById/:id', VoucherController.getVoucherById);
router.get('/getListPay/:id', VoucherController.getListPay);
router.get('/getListPay/:id/:nameVoucher', VoucherController.getListPay);

export default router;