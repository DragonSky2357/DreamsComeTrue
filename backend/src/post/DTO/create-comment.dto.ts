import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  public comment: string;
}
