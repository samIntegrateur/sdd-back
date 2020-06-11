import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { UserModel } from '../../entities/User';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

@ValidatorConstraint({ async: true })
export class IsUserPropertyAvailableConstraint implements ValidatorConstraintInterface {

  validate(value: string, validationArguments: ValidationArguments) {
    const { property } = validationArguments;
    return UserModel.findOne({[property]: value}).then(user => {
      return !user;
    });
  }

}

export function IsUserPropertyAvailable(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserPropertyAvailableConstraint,
    });
  };
}
