import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class AuthUserDto {
  fullname: string;

  email!: string;

  dialcode: string;

  phoneNumber!: string;


  password?: string;

  address?: string;

  id: string;

  phoneNumberConfirmed: boolean;

  emailConfirmed: boolean;

  twoFactorEnabled: boolean;

  accessFailedCount: number;

  enabled: boolean;

  createdAt: Date;

  updatedAt: Date;

}

