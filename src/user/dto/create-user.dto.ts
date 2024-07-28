import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  dialcode: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber!: string;



  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  provience: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  city: string;


  @IsNotEmpty()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @ApiProperty()
  junkType: string;
}
