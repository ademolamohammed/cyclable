import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
// import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { AccessJWTPayload } from '../interfaces/index.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTSECRETKEY,
    });
  }

  // async validate(payload: AccessJWTPayload) {
  //   const userStatus = await this.userService.isUserActiveorEnabled(payload.id);
  //   const userHasRole = payload.roleId;
  //   // const userPermissions = await this.roleService.getPermissionsForRoles(payload.roles);
  //   const userPermissions = userHasRole ? await this.testRoleService.getPermissionsForRoles([payload.roleId]) : [];

  //   // console.log({ userPermissions });
  //   if (!userStatus) throw new ForbiddenException('User is Not Active Or Enabled');
  //   return { ...payload, permissions: userPermissions };
  // }
}
