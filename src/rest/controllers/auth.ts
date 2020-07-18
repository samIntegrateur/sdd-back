import { verify } from 'jsonwebtoken';
import { UserModel } from '../../entities/User';
import { sendCookieToken } from '../../shared/auth/sendCookieToken';
import { createToken } from '../../shared/auth/auth';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { TOKEN_SECRET, TOKEN_NAME } = process.env;

// Full check of the cookie, send a new one if ok to extend session
export const isAuth = async (req: Request, res: Response) => {
  let token;

  try {
    token = req.cookies[TOKEN_NAME!];
    console.log('req.cookies', req.cookies);
    console.log('token', token);

    if (!token ) {
      throw new Error('No cookie');
    }

    let payload: any = null;

    payload = verify(token, TOKEN_SECRET!);
    console.log('payload', payload);

    if (!payload || !payload.userId) {
      throw new Error('Invalid payload');
    }

    const user = await UserModel.findOne({_id: payload.userId});

    if (!user) {
      throw new Error('User not found');
    }

    // Security : add a "versioning"
    // if (user.tokenVersion !== payload.tokenVersion) {
    //   console.log('bad token version');
    //   return res.send({ ok: false, accessToken: '' });
    // }

    sendCookieToken(res, createToken(user));

    return res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });

  } catch (e) {
    console.log(e.message);
    return res.status(401).send(false);
  }

}
