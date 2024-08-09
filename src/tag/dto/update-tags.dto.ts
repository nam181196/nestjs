import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class UpdateTagsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  tagIds: number[];
}
