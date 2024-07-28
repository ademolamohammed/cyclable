import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyPhoneNumberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
