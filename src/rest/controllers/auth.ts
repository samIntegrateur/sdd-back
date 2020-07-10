import { verify } from 'jsonwebtoken';
import { UserModel } from '../../entities/User';
import { sendRefreshToken } from '../../shared/auth/sendRefreshToken';
import { createAccessToken, createRefreshToken } from '../../shared/auth/auth';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { AUTH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_SECRET } = process.env;


export const refreshToken = async (req: Request, res: Response) => {

  let token;

  try {
    token = req.cookies[AUTH_TOKEN_COOKIE_NAME!];
    console.log('cookies', req.cookies)
    console.log('AUTH_TOKEN_COOKIE_NAME', AUTH_TOKEN_COOKIE_NAME);
    console.log('req.cookies[AUTH_TOKEN_COOKIE_NAME!];', req.cookies[AUTH_TOKEN_COOKIE_NAME!]);
  } catch (e) {
    console.log('e', e);
    return res.send({ ok: false, accessToken: '' });
  }

  if (!token ) {
    console.log('no cookie');
    return res.send({ ok: false, accessToken: '' });
  }

  let payload: any = null;

  try {
    payload = verify(token, REFRESH_TOKEN_SECRET!);
    console.log('payload', payload);
  } catch (e) {
    console.log('e', e);
    return res.send({ ok: false, accessToken: '' });
  }

  // token valid, we can send back an access token
  const user = await UserModel.findOne({_id: payload.userId});

  if (!user ) {
    console.log('user not found');
    return res.send({ ok: false, accessToken: '' });
  }

  // Security : add a "versioning"
  if (user.tokenVersion !== payload.tokenVersion) {
    console.log('bad token version');
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
};
