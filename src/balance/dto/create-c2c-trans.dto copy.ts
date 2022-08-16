import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateC2CTransDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User ID',
    default: '12m91d829424d',
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

  @ApiProperty({
    type: String,
    // required: true,
    description: 'Comment Trant',
    default: '',
  })
  @IsString()
  comment: string;
}
