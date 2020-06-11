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

  @Field()
  @Prop()
  firstName?: string;

  @Field()
  @Prop()
  lastName?: string;
}

export const UserModel = getModelForClass(User);
