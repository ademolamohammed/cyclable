import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Request,
  ForbiddenException,
  UseGuards,
  NotFoundException,
  Param,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  LoginByTokenDto,
  LoginDto,
  ResetPassFromProfileDto,
} from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/request/public-request.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyPhoneNumberDto } from './dto/verify-phone.dto';
import { AuthenticatedUser } from '../shared/decorators/request/authenticated-user.decorator';
import { RequiredPermissions } from '../shared/decorators/request/required-permissions.decorator';
import { UserService } from 'src/user/user.service';

export class VerifyDto {
  email: string;
  token: string;
}

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('resetPassFromProfile')
  async resetPassFromProfile(
    @AuthenticatedUser('email') email: string,
    @Body() body: ResetPassFromProfileDto,
  ) {
    try {
      body.email = email;
      return await this.authService.resetPassFromProfile(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @ApiBearerAuth()
  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService
      .registerUser(body)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('forgotpassword')
  async forgotpassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.forgotPassword(body.email).catch((error) => {
      throw new BadRequestException(error);
    });
  }

  // @ApiBearerAuth()
  // @Public()
  // @Post('sendPhoneNumberOTP')
  // async sendPhoneNumber(
  //   @Body() body: VerifyPhoneNumberDto,
  // ): Promise<{ message: string }> {
  //   return await this.userService
  //     .saveandSendPhoneOTP(body.phoneNumber)
  //     .catch((error) => {
  //       throw new BadRequestException(error);
  //     });
  // }

  @ApiBearerAuth()
  @Public()
  @Post('verifyPhoneNumber/:otp')
  async verifyPhoneNumber(
    @Param('otp') otp: string,
    @Body() body: VerifyPhoneNumberDto,
  ): Promise<{ message: string }> {
    const { phoneNumber } = body;
    return await this.userService
      .verifyPhoneOTP(phoneNumber, otp)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @ApiBearerAuth()
  @Public()
  @Post('resetpassword/:token')
  async resetpassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<{ message: string }> {
    // const date = new Date().toISOString();
    // const resetPasswordExpire = Raw((alias) => `${alias} > :date`, {
    //   date: date,
    // });
    const { password } = body;
    return await this.authService
      .resetPassword(token, body.password)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  // @ApiBearerAuth()
  // @Public()
  // @Post('loginbytoken/:token')
  // async loginbytoken(
  //   @Param('token') token: string,
  //   @Body() body: LoginByTokenDto,
  // ): Promise<AuthResponseDto> {
  //   return await this.authService
  //     .verifyHospitalandHAMAfterOnboarding(token, body.email)
  //     .catch((error) => {
  //       throw new BadRequestException(error);
  //     });
  // }

  @ApiBearerAuth()
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Request() req,
    @Body() data: LoginDto,
  ): Promise<{ message: string }> {
    return req.user;
  }

  @ApiBearerAuth()
  @Public()
  @Post('login/otp/:otp')
  async otpValidate(
    @Body() body: LoginByTokenDto,
    @Param('otp') otp: string,
  ) {
    return await this.authService
      .loginValidateOTP(body.email, otp)
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  @Get('profile')
  async getProfile(
    @Request() req,
    @AuthenticatedUser('id') id: string,
  ) {
    try {
      const user = await this.userService.findOne({ where: { id } });
      if (!user) throw new ForbiddenException();
      return { user: { ...user, password: undefined } };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }


}
