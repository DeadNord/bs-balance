import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateC2CTransDto {
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

  // @ApiProperty({
  //   type: String,
  //   required: false,
  //   description: 'Comment Trans',
  // })
  // @IsString()
  // @IsOptional()
  // comment: string;
}

export { CreateC2CTransDto };
