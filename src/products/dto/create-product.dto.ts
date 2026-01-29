import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @Type(() => Number)
  categoryId: number; // এই আইডিটা ক্যাটাগরি টেবিল থেকে আসতে হবে
}