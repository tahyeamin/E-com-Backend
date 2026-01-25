// src/categories/dto/create-category.dto.ts
import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category name must be a string' })
  @IsNotEmpty({ message: 'Category name is required' })
  @MinLength(3, { message: 'Category name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional() // এটি অপশনাল, না দিলেও সমস্যা নেই
  description?: string;
}