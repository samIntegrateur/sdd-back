import { Query, Arg, Resolver, Mutation, Ctx, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User, UserModel } from '../../entities/User';
import { RegisterInput } from './RegisterInput';
import { AppContext } from '../../types/AppContext';
import { isAuth } from '../../middleware/isAuth';

@Resolver()
export class RegisterResolver {

  // @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello world";
  }

  @UseMiddleware(isAuth)
  @Query(() => String)
  async helloLogged(
    @Ctx() ctx: AppContext,
  ) {
    console.log('payload', ctx.payload);
    return "Hello user";
  }

  // todo, check username and email unicity
  @Mutation(() => User)
  async register(
    @Arg('data') {
      username,
      email,
      password,
      firstName,
      lastName,
    }: RegisterInput,
    @Ctx() ctx: AppContext,
  ): Promise<User> {

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await (await UserModel.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    })).save();

    if (!user) {
      throw new Error("Le compte n'a pas pu être créé.");
    }

    console.log('user', user);

    return user;
  }
}
