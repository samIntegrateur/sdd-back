import { sign } from 'jsonwebtoken';
import { User } from '../../entities/User';

// todo : add expiration data and logic
export const createToken = (user: User) => {
  return sign({ userId: user.id, }, process.env.TOKEN_SECRET!, {
    expiresIn: '30 days'
  })
};
