import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../types/AppContext';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { TOKEN_NAME } = process.env;

// Expect an authorization header with value 'bearer ${token}'
export const isAuth: MiddlewareFn<AppContext> = async ({ context }, next) => {
  // const authorization = context.req.headers['authorization'];
  //
  // if (!authorization) {
  //   throw new Error('Not authenticated');
  // }

  try {
    const token = context.req.cookies[TOKEN_NAME!];
    const payload = verify(token, process.env.TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (e) {
    console.log('er', e);
    throw new Error('Not authenticated');
  }

  return next();
};
