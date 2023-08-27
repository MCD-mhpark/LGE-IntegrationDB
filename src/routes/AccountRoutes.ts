import express, {Request, Response} from 'express';
import AccountController from '@src/controller/AccountController';

const router = express.Router();

router.post('/update', AccountController.DB_to_Account);





export default router;