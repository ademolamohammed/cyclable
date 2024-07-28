import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class AuthUserDto {
  fullname: string;

  email!: string;

  dialcode: string;

  phoneNumber!: string;

  hospitalId!: string;

  roleId?: string;

  roleIds?: string[];

  password?: string;

  address?: string;

  id: string;

  phoneNumberConfirmed: boolean;

  emailConfirmed: boolean;

  twoFactorEnabled: boolean;

  accessFailedCount: number;

  enabled: boolean;

  staffId: string;

  createdAt: Date;

  updatedAt: Date;

  role?: object;

  gender: string;
}

