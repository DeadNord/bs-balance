import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

class PaginateDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  limit: number;
}

export { PaginateDto };
