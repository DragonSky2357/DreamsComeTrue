import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public avatar: string;

  @IsString()
  @IsOptional()
  public username: string;

  @IsString()
  @IsOptional()
  public introduce: string;

  @Type(() => String)
  @IsString({ each: true })
  @IsOptional()
  public tag?: string[];

  @IsString()
  @IsOptional()
  public password: string;
}
