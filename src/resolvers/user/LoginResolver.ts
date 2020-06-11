import { Arg, Resolver, Mutation, Ctx } from 'type-graphql';
import { User, UserModel } from '../../entities/User';
import bcrypt from 'bcryptjs';
import { AppContext } from '../../types/AppContext';

@Resolver()
export class LoginResolver {

  @Mutation(() => User)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: AppContext,
  ): Promise<User | Error> {

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("L'e-mail est invalide.");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Le mode de passe est invalide.");
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}
