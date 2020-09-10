import { Field, InputType } from 'type-graphql';
import { Offer } from '../../entities/Offer';
import { Length } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class OfferInput implements Partial<Offer> {

  @Field()
  @Length(3, 50)
  title: string;

  @Field()
  @Length(3, 600)
  description: string;

  // do we need this for update ?
  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}
