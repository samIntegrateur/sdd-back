import { Query, Arg, Resolver, Mutation, UseMiddleware, Ctx } from 'type-graphql';
import { Offer, OfferModel } from '../../entities/Offer';
import { OfferInput } from './OfferInput';
import { isAuth } from '../../middleware/isAuth';
import { AppContext } from '../../types/AppContext';
import { UserModel } from '../../entities/User';

@Resolver()
export class OfferResolver {

  @Query(_returns => Offer, { nullable: false })
  async getOffer(@Arg('id') id: string) {
    return OfferModel.findById({ _id: id })
      .populate('author');
  }

  @Query(_returns => [Offer])
  async getOffers() {
    return OfferModel.find()
      .populate('author');
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Offer)
  async createOffer(
    @Arg("data") {
      title,
      description,
      imageUrl,
    }: OfferInput,
    @Ctx() ctx: AppContext,
  ): Promise<Offer> {

    const authorId = ctx.payload?.userId;

    if (!authorId) {
      throw new Error("AuthorId was not found.");
    }

    const user = await UserModel.findById(authorId);

    if (!user) {
      throw new Error("User was not found.");
    }

    return (await OfferModel.create({
      title,
      description,
      imageUrl,
      author: user._id,
    })).save();
  }

}
