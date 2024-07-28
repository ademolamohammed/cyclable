import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as crypto from 'crypto';
import { AbstractService } from 'src/common/abstract/abstract.service';
import { User } from './entities/user.entity';
import { UserResponseDTO } from './dto/userResponse.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class UserService extends AbstractService<User>  {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    // @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {
    super(userRepository);
  }


  generateToken(): string {
    const token = crypto.randomBytes(3).toString('hex');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async verifyPhoneOTP(
    phone: string,
    OTP: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.findOne({
        where: { phoneNumber: phone, phoneOTP: OTP },
      });
      if (!user) throw new Error('Invalid OTP.');
      user.phoneOTP = null;
      user.phoneOTPExpire = null;
      user.phoneNumberConfirmed = true;
      await this.update(user.id, user);
      return { message: 'Phone Number Verification Successful.' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(data: CreateUserDto) {

    const checkUserEmail = this.findOne({ where: { id: data.email } });
    if (!checkUserEmail) return Promise.reject('Email already exist.');

    const signupToken = this.generateToken();
    const user = await this.create({ ...data, signupToken });

    return new UserResponseDTO(user);

  }


}
