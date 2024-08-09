import { Type,Transform } from 'class-transformer';
import { IsArray, IsOptional, IsNumber, ArrayNotEmpty, IsInt, ValidateIf } from 'class-validator';

export class FindProductsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @ValidateIf((o) => typeof o.tagIds === 'string')
  @Transform(({ value }) => { //Nếu là chuỗi -> số nguyên, kp chuỗi -> giữ nguyên
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id, 10));
    }
    return value;
  }, { toClassOnly: true })
  @IsArray()
  @ArrayNotEmpty({ message: 'tagIds should not be empty' })
  @IsInt({ each: true, message: 'Each tagId must be an integer' })
  tagIds?: number[];

}
