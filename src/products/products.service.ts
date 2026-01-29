import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, imageUrl: string) {
    // আগে চেক করি ক্যাটাগরি আইডিটি আছে কি না
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(`Category ID ${dto.categoryId} পাওয়া যায়নি!`);
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        image: imageUrl, // কন্ট্রোলার থেকে পাঠানো ইমেজের পাথ
        categoryId: dto.categoryId,
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }
}