import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsInt, IsOptional } from "class-validator";

export class PaginationQueryParamsDto {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => +value)
    page: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsInt()
    @IsOptional()
    @Transform(({ value }) => +value)
    limit: number;
}