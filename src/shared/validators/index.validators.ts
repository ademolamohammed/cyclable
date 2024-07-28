import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isCurrentOrFutureDate', async: false })
export class IsCurrentOrFutureDateConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return new Date(propertyValue).getTime() > new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime();
    // return propertyValue < args.object[args.constraints[0];
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a future date`;
  }
}
