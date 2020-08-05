import { Field, ID, ObjectType } from 'type-graphql';
import { Prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { User } from './User';

import { WithTimestamps } from './shared/WithTimestamps';
import { OfferStatus } from './shared/OfferStatus.type';


@ObjectType({ implements: WithTimestamps, description: 'The Offer model' })
export class Offer extends WithTimestamps {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  imageUrl?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  thumbUrl?: string;

  @Field(_type => String)
  @Prop({ ref: User, required: true })
  author: Ref<User>;

  @Field(_type => OfferStatus)
  @Prop({ required: false, enum: OfferStatus, type: String, default: OfferStatus.AVAILABLE})
  status?: OfferStatus;
}

export const OfferModel = getModelForClass(Offer, {schemaOptions: { timestamps: true }});
