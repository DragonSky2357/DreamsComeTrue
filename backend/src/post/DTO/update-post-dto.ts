import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  describe?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
