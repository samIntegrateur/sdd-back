import { Field, ID, ObjectType } from 'type-graphql';
import { Prop, getModelForClass } from '@typegoose/typegoose';


@ObjectType({ description: 'The User model' })
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  // no field, we dont want to expose the password
  @Prop({ required: true })
  password: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  firstName?: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  lastName?: string;

  // Add version for forget password or account hacked
  // https://www.youtube.com/watch?v=25GS0MLT8JU around 1:18
  // todo: reimplement this kind of logic for the current token system
  @Prop( { type: String, default: 0 })
  tokenVersion?: number;
}

export const UserModel = getModelForClass(User);
