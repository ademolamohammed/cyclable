import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ResetPassFromProfileDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { In, MoreThan } from 'typeorm';
import { AccessJWTPayload } from './interfaces/index.interface';
import { User } from '../user/entities/user.entity';
// import { EmailService } from 'src/email/email.service';
// import { SmsService } from 'src/sms/sms.service';
import { decryptPassword } from 'src/user/user.utils';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => EmailService)) private emailService: EmailService,
    // private smsService: SmsService,
  ) {}

  private getTokenExpires() {
    // const endDate = new Date(new Date().setHours(23, 59, 59, 0)).getTime();
    // const expiresIn = Math.abs((new Date().getTime() - endDate) / 1000);
    // return Math.floor(expiresIn);
    return 12 * 60 * 60; // 12 Hours
  }

  async getToken(input: AccessJWTPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(input, {
      secret: process.env.JWTSECRETKEY,
      expiresIn: this.getTokenExpires(),
    });
    return accessToken;
  }

  async registerUser(body: RegisterDto) {
    try {
      const user = await this.register(body);
      const { id, firstName, email } = user;
      const token = await this.getToken({
        id,
        email,
        name: firstName,
      });
      return { token, user: { ...user, password: undefined } };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async register(
    data: RegisterDto & { id?: string },
  ) {
    try {

      if(data.code !== "9999")  throw new BadRequestException(
        'Invalid unique code',
      );

      const { email, phoneNumber } = data;
      const existingEmail = await this.userService.findOne({
        where: { email },
      });
      if (existingEmail)
        throw new BadRequestException(
          'Email address already exists in database',
        );
      const existingPhone = await this.userService.findOne({
        where: { phoneNumber },
      });
      if (existingPhone)
        throw new BadRequestException(
          'Phone Number already exists in database',
        );
      const user = await this.userService.create({...data});
          //send Email
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userService.findOne({ where: { email } });
      if (!user) throw new Error('User Does Not Exist');
      const { firstName: name } = user;
      user.resetPasswordToken = this.generateLongToken();
      user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
      await this.userService.update(user.id, user);
      const url = `${process.env.FRONTENDURL}resetpassword/${user.resetPasswordToken}`;
      // await this.emailService.sendResetPasswordEmail(name, email, url);
      return { message: 'Password Reset Email Sent Successfully' };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    try {
      const query = {
        resetPasswordToken: token,
        resetPasswordExpire: MoreThan(new Date()),
      };
      const user = await this.userService.findOne({ where: query });
      if (!user) throw new Error('Invalid Token');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = null;
      user.resetPasswordExpire = null;
      await this.userService.update(user.id, user);
      return { message: 'Password Reset Successful' };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  uniqueCode() {

    return "39990"
  }

  async signin(data: LoginDto): Promise<any> {
    try {
      const { email, password } = data;
      const user = await this.userService.findOne({
        where: { email }
      });
      
      

      if (!user) return Promise.reject('Invalid Credentials.');
      // if (!user.enabled) return Promise.reject('Account is Disabled.');

      
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) return Promise.reject('Invalid Credentials.');
      const otp = this.generateLoginOtp();

      const otpExpires = new Date(Date.now() + 2 * 60 * 1000).toISOString(); //2 minutes
      await this.userService.update(user.id, {
        loginOTP: otp,
        loginOTPExpire: otpExpires,
      });
      const { firstName: name = 'Sample ' } = user;

      const emailData = {
        client_name:`${user.firstName}`,
        token:otp
      }
      await this.emailService.sendMail("makaveli@email.com", "Welcome","LoginOtp",emailData);

      return { message: 'Login Successful' };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassFromProfile(data: ResetPassFromProfileDto): Promise<any> {
    try {
      const { email, oldPassword, newPassword } = data;
      const user = await this.userService.findOne({ where: { email } });
      if (!user)
        throw new HttpException('Invalid Credentials.', HttpStatus.BAD_REQUEST);

      // Validate new

      if (!this.validPasswordComplexity(data.newPassword)) {
        throw new HttpException(
          'Password must contain a minimum of 8 characters, at least a lowercase, at least uppercase, at least a special character and at least a number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newPasswordMatchesOld = await bcrypt.compare(
        newPassword,
        user.password,
      );
      if (newPasswordMatchesOld) {
        throw new HttpException(
          'Provide a password you have not used very recently.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate Old

      const oldPasswordMatches = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (!oldPasswordMatches) {
        throw new HttpException('Invalid Credentials.', HttpStatus.BAD_REQUEST);
      } else {
        // Reset

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;
        await this.userService.update(user.id, user);
        return { message: 'Password Reset Successful' };
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private validPasswordComplexity(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/~])[A-Za-z\d!@#$%^&*()_\-+={}[\]\\|:;"'<>,.?/~]{8,}$/;
    return regex.test(password);
  }

  // generateLoginToken(): string {
  //   const token = crypto.randomBytes(3).toString('hex');
  //   return crypto.createHash('sha256').update(token).digest('hex');
  // }


  async loginValidateOTP(email: string, otp: string) {
    try {
      let user: User = null;
      if (
        process.env.IS_PRODUCTION === 'false' &&
        otp === process.env.SAMPLE_OTP
      ) {
        user = await this.userService.findOne({
          where: { email },
          select: [
            'email',
            'loginOTP',
            'loginOTPExpire',
            'id',
            'firstName',
          ],
        });
      } else {
        user = await this.userService.findOne({
          where: { email, loginOTP: otp },
          select: [
            'email',
            'loginOTP',
            'loginOTPExpire',
            'id',
            'firstName',
          ],
        });
      }
      if (!user || !user.loginOTPExpire) throw new Error('Invalid Token');
      // console.log({ loginOTPExpire: user.loginOTPExpire, current: new Date().getTime(), curr: Date.now(), exp: new Date(user.loginOTPExpire).getTime() })
      // console.log(user);
      console.log('User Found');
      if (new Date().getTime() > new Date(user.loginOTPExpire).getTime())
        throw new Error('Token Expired');

      const { id, firstName } = user;
      // const permission = this.permissionService.find({where: { :roleId}});
      const token = await this.getToken({
        id: id,
        name: firstName,
        email
      });
      console.log('Token', token);
      const updatedUser = await this.userService.update(id, {
        loginOTP: null,
        loginOTPExpire: null,
      });

      console.log('Found roles with permissions');
      return {
        token,
        user: { ...updatedUser, password: undefined },
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  generateLongToken(): string {
    const token = crypto.randomBytes(3).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  generateToken(): string {
    // const token = crypto.randomBytes(32).toString('hex');
    // return crypto.createHash('sha256').update(token).digest('hex');
    return crypto.randomInt(999999).toString().substr(0, 6);
  }

  generateLoginOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // getPasswordResetToken(token: string): string {
  //   return crypto.createHash('sha256').update(token).digest('hex');
  // }

  async userId(request: Request): Promise<number> {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return data['id'];
  }
}
