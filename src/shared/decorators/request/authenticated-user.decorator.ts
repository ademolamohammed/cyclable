import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessJWTPayload } from '../../../auth/interfaces/index.interface';

export const AuthenticatedUser = createParamDecorator((data: keyof AccessJWTPayload, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  // console.log('Request: ',request);
  const user = request.user as AccessJWTPayload;

  return data ? user?.[data] : user;
});
