import { ApiProperty } from '@nestjs/swagger';

class ErrorObject {
  @ApiProperty({ description: 'error message can be a string or object' })
  message: string;
}

export class ErrorResponse {
  @ApiProperty({ example: 'error' })
  status: string;

  @ApiProperty({ description: 'error message can be a string or object', example: 'error message can be a string or object' })
  message: string | object;

  // @ApiProperty({ type: ErrorObject })
  // error: ErrorObject;
}
