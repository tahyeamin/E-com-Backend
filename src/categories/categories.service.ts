import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    return this.prisma.category.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  // এখানে id এর টাইপ number করে দেওয়া হয়েছে কারণ আপনার স্কিমাতে Int আছে
  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: id }, // প্রিজমা এখন খুশি হবে কারণ সে নাম্বার পাচ্ছে
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }
}