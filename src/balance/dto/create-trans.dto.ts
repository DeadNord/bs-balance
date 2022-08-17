import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateTransDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User ID',
    default: '62cd5a61408352bb8b7c1b79',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Transactions sum',
    default: '10',
  })
  @IsNotEmpty()
  sum: number;

  // @ApiProperty({
  //   type: String,
  //   required: false,
  //   description: 'Comment Trans',
  // })
  // @IsString()
  // @IsOptional()
  // comment: string;
}

export { CreateTransDto };
