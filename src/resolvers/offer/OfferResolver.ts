import { Query, Arg, Resolver, Mutation } from 'type-graphql';
import { Offer, OfferModel } from '../../entities/Offer';
import { OfferInput } from './OfferInput';

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

  @Mutation(() => Offer)
  async createOffer(@Arg("data"){
    title,
    description,
    imageUrl,
    thumbUrl,
    author,
  }: OfferInput): Promise<Offer> {
    return (await OfferModel.create({
      title,
      description,
      imageUrl,
      thumbUrl,
      author,
    })).save();
  }

}
