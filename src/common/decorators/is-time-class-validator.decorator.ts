import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

// Custom Time Validator
@ValidatorConstraint({ async: false })
class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(time: string, args: ValidationArguments) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time); // Check if time is in HH:MM format
  }

  defaultMessage(args: ValidationArguments) {
    return 'Time ($value) must be in the format HH:MM (24-hour format)';
  }
}

// Custom decorator
export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTimeConstraint,
    });
  };
}
