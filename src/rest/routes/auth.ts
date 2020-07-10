import express from 'express';
import { refreshToken } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/refresh-token', refreshToken);

export default authRouter;
