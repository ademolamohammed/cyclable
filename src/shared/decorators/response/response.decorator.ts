import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponse } from '../../../shared/dto/error-response.dto';
import { SuccessResponse } from '../../../shared/dto/success-response.dto';

export const SuccessApiResponse = <TModel extends Type<any>>(
  model: TModel,
  options: { isArray?: boolean; status?: number | HttpStatus } = {
    isArray: true,
    status: 200,
  },
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: options?.isArray
              ? {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                }
              : {
                  data: {
                    allOf: [{ $ref: getSchemaPath(model) }],
                  },
                },
          },
        ],
      },
      status: options.status || 200,
    }),
  );
};

export const ErrorApiResponse = (
  options: { status?: number | HttpStatus } = {
    status: 400,
  },
) => {
  return applyDecorators(
    ApiResponse({
      schema: {
        allOf: [{ $ref: getSchemaPath(ErrorResponse) }],
      },
      status: options.status,
    }),
  );
};
