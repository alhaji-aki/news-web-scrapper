import { ValidationPipeOptions } from '@nestjs/common';

export const generalValidationOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
};

export const customDecoratorsValidationOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  validateCustomDecorators: true,
  transformOptions: {
    enableImplicitConversion: true,
    strategy: 'exposeAll',
  },
};
