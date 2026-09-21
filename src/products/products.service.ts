import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  
  async create(dto: CreateProductDto, imageUrls: string[]) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(dto.categoryId) }, 
    });

    if (!category) {
      throw new NotFoundException(`Category ID ${dto.categoryId} not found`);
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description || "",
        price: Number(dto.price), 
        stock: Number(dto.stock), 
        image: imageUrls,
        categoryId: Number(dto.categoryId), 
      },
    });
  }

  
  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }


  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not Found');
    return product;
  }

 
  async update(id: number, dto: any, imageUrls?: string[]) {
    
    const existingProduct = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name ?? existingProduct.name,
        description: dto.description ?? existingProduct.description,
      
        price: dto.price ? Number(dto.price) : existingProduct.price,
        stock: dto.stock ? Number(dto.stock) : existingProduct.stock,
        categoryId: dto.categoryId ? Number(dto.categoryId) : existingProduct.categoryId,
      
        ...(imageUrls && imageUrls.length > 0 && { image: imageUrls }),
      },
    });
  }

 
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
