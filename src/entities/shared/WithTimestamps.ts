import { Field, InterfaceType } from 'type-graphql';

// Implements / extends* timestamps fields
// NB 1 : You still need to add { schemaOptions: { timestamps: true }} to getModelForClass
// NB 2* : Interface is "weird" because it doesn't exists in GraphQl, see https://typegraphql.com/docs/interfaces.html
@InterfaceType({ description: 'Add mongodb timestamps fields' })
export abstract class WithTimestamps {
  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
