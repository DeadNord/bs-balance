import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'From who User ID',
    default: 'andj283wofj3ff53',
  })
  @IsNotEmpty()
  @IsString()
  from: string;

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

  @ApiProperty({
    type: String,
    // required: true,
    description: 'Comment Trant',
    default: '',
  })
  @IsString()
  comment: string;
}
