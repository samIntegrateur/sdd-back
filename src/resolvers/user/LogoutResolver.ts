import { Resolver, Mutation, Ctx } from 'type-graphql';
import { sendRefreshToken } from '../../shared/auth/sendRefreshToken';
import { AppContext } from '../../types/AppContext';

@Resolver()
export class LogoutResolver {

  @Mutation(() => Boolean)
  async logout( @Ctx() {res}: AppContext) {
    sendRefreshToken(res, '');
    return true;
  }
}
