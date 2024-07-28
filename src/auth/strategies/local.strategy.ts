import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<{ message: string }> {
    try {
      console.log("dsfjkdslsd");
      return await this.authService.signin({ email, password });
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }
}
