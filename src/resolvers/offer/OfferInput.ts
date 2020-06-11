import { Field, ID, InputType } from 'type-graphql';
import { Offer } from '../../entities/Offer';
import { IsUrl, Length } from 'class-validator';
import { ObjectId } from 'mongodb';

@InputType()
export class OfferInput implements Partial<Offer> {

  @Field()
  @Length(3, 255)
  title: string;

  @Field()
  @Length(3, 255)
  description: string;

  @Field({ nullable: true })
  @IsUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  thumbUrl?: string;

  @Field(() => ID)
  author: ObjectId;
}
