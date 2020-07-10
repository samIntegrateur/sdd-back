import { Arg, Resolver, Mutation, Ctx, ObjectType, Field } from 'type-graphql';
import { User, UserModel } from '../../entities/User';
import bcrypt from 'bcryptjs';
import { AppContext } from '../../types/AppContext';
import { sendRefreshToken } from '../../shared/auth/sendRefreshToken';
import { createAccessToken, createRefreshToken } from '../../shared/auth/auth';

@ObjectType()
class LoginResponse {

  @Field()
  accessToken: string;

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

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error("L'e-mail est invalide.");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Le mode de passe est invalide.");
    }

    // this cookie can be sent with a post to "refresh-token" to get a new accessToken
    sendRefreshToken(res, createRefreshToken(user));

    // this one will be sent in headers for authent only queries (see isAuth)
    return {
      accessToken: createAccessToken(user),
      user,
    }
  }
}
