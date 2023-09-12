import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public username: string;

  @IsString()
  @IsOptional()
  public password: string;

  @IsString()
  @IsOptional()
  public avatar: string;
}
