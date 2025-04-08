import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class VerifyDto {
  @ApiProperty({ description: 'verification code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;
}
