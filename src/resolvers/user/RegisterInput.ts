import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';
import { IsEmail, Length } from 'class-validator';
import { IsUserPropertyAvailable } from './IsUserPropertyAvailable';

@InputType()
export class RegisterInput implements Partial<User> {

  // todo : why do I have the complicated error format ?
  // I want to have the message at top level

  @Field()
  @Length(3, 20, { message: "Le nom d'utilisateur doit comporter entre 3 et 20 caractères." })
  @IsUserPropertyAvailable({ message: "Le nom d'utilisateur est déjà pris." })
  username: string;

  @Field()
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide.'" })
  @IsUserPropertyAvailable({ message: "L'adresse e-mail est déjà prise." })
  email: string;

  @Field()
  @Length(6, 20, { message: "Le mot de passe doit comporter entre 3 et 20 caractères." })
  password: string;

  @Field({ nullable: true })
  @Length(1, 30, { message: "Le prénom doit comporter entre 1 et 30 caractères." })
  firstName?: string;

  @Field({ nullable: true })
  @Length(1, 30, { message: "Le nom  doit comporter entre 1 et 30 caractères." })
  lastName?: string;

}
