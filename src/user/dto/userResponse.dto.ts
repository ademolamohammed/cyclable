import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

import { User } from "../entities/user.entity";


export class UserResponseDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    enabled: boolean;

    @ApiProperty()
    gender: string;

    @ApiProperty()
    dialcode: string;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ nullable: true })
    address: string;

    @ApiProperty()
    province: string;


    @ApiProperty()
    city: string;

    @ApiProperty({ nullable: true })
    specializationId: string;



    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(data: User) {
        this.id = data.id;
        this.lastName = data.lastName;
        this.dialcode = data.dialcode;
        this.phoneNumber = data.phoneNumber;
        this.email = data.email;
        this.address = data.address;
        this.province = data.province;
        this.city = data.city;
        this.enabled = data.enabled
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}