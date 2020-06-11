import { Field, ID, ObjectType } from 'type-graphql';
import { Prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { User } from './User';
import { Ref } from '../types';

@ObjectType({ description: 'The Offer model' })
@modelOptions({})
export class Offer {

  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  description: string;

  @Field()
  @Prop()
  imageUrl?: string;

  @Field()
  @Prop()
  thumbUrl?: string;

  @Field(_type => String)
  @Prop({ ref: User, required: true })
  author: Ref<User>;
}

export const OfferModel = getModelForClass(Offer);
