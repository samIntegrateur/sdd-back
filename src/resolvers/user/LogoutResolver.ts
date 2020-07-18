import { Resolver, Mutation, Ctx } from 'type-graphql';
import { sendCookieToken } from '../../shared/auth/sendCookieToken';
import { AppContext } from '../../types/AppContext';

@Resolver()
export class LogoutResolver {

  @Mutation(() => Boolean)
  async logout( @Ctx() {res}: AppContext) {
    sendCookieToken(res, '');
    return true;
  }
}
