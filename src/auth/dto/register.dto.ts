import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  dialcode: string;

  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber!: string;

  @IsNotEmpty()
  @ApiProperty()
  hospitalId!: string;

  @IsNotEmpty()
  @ApiProperty()
  roleId: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  address!: string;
}
