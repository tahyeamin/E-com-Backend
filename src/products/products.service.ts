import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create Product with Multiple Images
  async create(dto: CreateProductDto, imageUrls: string[]) {
    const category = await this.prisma.category.findUnique({ 
      where: { id: dto.categoryId } 
    });
    if (!category) throw new NotFoundException('Category not found!');

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description || "",
        price: dto.price,
        stock: dto.stock,
        image: imageUrls, //
        categoryId: dto.categoryId,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ 
      where: { id }, 
      include: { category: true } 
    });
    if (!product) throw new NotFoundException('Product not found!');
    return product;
  }

  async update(id: number, dto: any, imageUrls?: string[]) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrls && imageUrls.length > 0 && { image: imageUrls }), //
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}