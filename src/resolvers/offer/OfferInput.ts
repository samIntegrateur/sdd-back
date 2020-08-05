import { Field, InputType } from 'type-graphql';
import { Offer } from '../../entities/Offer';
import { IsUrl, Length } from 'class-validator';

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
}
