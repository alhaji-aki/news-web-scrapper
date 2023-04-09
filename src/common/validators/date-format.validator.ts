import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { parse } from 'date-fns';

@ValidatorConstraint()
export class DateFormatValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (!value) return true;

    let formats: string | string[] = args.constraints[0];

    if (typeof formats == 'string') {
      formats = [formats];
    }

    try {
      for (const format of formats) {
        const date = parse(value, format, new Date());

        if (date.toString() !== 'Invalid Date') {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    let formats: string | string[] = args.constraints[0];

    if (typeof formats == 'string') {
      formats = [formats];
    }

    return `The value submitted is not a valid date. Accepted formats are ${formats.join(
      ', ',
    )}`;
  }
}

export function IsValidDateFormat(
  formats: string | string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [formats],
      validator: DateFormatValidator,
    });
  };
}
