import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public describe: string;

  @IsNotEmpty()
  @IsString()
  public image: string;

  @IsOptional()
  @IsNumber()
  public rating: number;

  @IsOptional()
  @IsString({ each: true })
  public tags: string[];
}
