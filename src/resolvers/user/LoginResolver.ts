import { Arg, Resolver, Mutation, Ctx, ObjectType, Field } from 'type-graphql';
import { User, UserModel } from '../../entities/User';
import bcrypt from 'bcryptjs';
import { AppContext } from '../../types/AppContext';
import { createToken } from '../../shared/auth/auth';
import { sendCookieToken } from '../../shared/auth/sendCookieToken';

@ObjectType()
class LoginResponse {

  @Field(() => User)
  user: User;
}

@Resolver()
export class LoginResolver {

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() {res}: AppContext,
  ): Promise<LoginResponse> {

    console.log('login');

    const user = await UserModel.findOne({ email }) as User;

    if (!user) {
      throw new Error("L'e-mail est invalide.");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Le mode de passe est invalide.");
    }

    sendCookieToken(res, createToken(user));

    return {
      user,
    }
  }
}
