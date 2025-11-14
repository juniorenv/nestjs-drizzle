import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

export function AtLeastOneField(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (target: new (...args: any[]) => object) {
    registerDecorator({
      propertyName: "AtLeastOneProperty",
      constraints: properties,
      target: target,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const fields = args.constraints;
          const obj = args.object as Record<string, any>;
          return fields.some(
            (field: string) => obj[field] !== undefined && obj[field] !== null,
          );
        },
        defaultMessage(args: ValidationArguments) {
          const fields = args.constraints;
          return `At least one property must be provided for update: ${fields.join(", ")}`;
        },
      },
    });
  };
}
