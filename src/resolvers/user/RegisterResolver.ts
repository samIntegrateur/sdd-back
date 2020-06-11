import { Query, Arg, Resolver, Mutation, UseMiddleware, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User, UserModel } from '../../entities/User';
import { RegisterInput } from './RegisterInput';
import { isAuth } from '../../middleware/isAuth';
import { AppContext } from '../../types/AppContext';

@Resolver()
export class RegisterResolver {

  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return "Hello world";
  }

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
    ctx.req.session!.userId = user.id;

    return user;
  }
}
