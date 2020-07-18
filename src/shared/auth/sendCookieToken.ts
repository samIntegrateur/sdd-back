import { Response } from 'express';

export const sendCookieToken = (res: Response, token: string) => {
  res.cookie(process.env.TOKEN_NAME!,
    token,
    {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      // see https://www.youtube.com/watch?v=ZAsZ2hhdj-s 4:00
      // path: '/is-auth'
    }
  );
};
