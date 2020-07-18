import express from 'express';
import { isAuth } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/is-auth', isAuth);

export default authRouter;
