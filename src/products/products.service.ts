import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ১. প্রোডাক্ট তৈরি
  async create(dto: CreateProductDto, imageUrl: string) {
    const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('ভুল ক্যাটাগরি আইডি দিয়েছেন!');

    return this.prisma.product.create({
      data: { ...dto, image: imageUrl },
    });
  }

  // ২. সব প্রোডাক্ট দেখা
  async findAll() {
    return this.prisma.product.findMany({ include: { category: true } });
  }

  // ৩. একটা নির্দিষ্ট প্রোডাক্ট দেখা
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) throw new NotFoundException('প্রোডাক্ট পাওয়া যায়নি!');
    return product;
  }

  // ৪. আপডেট করা
  async update(id: number, dto: Partial<CreateProductDto>, imageUrl?: string) {
    await this.findOne(id); // চেক করছি প্রোডাক্ট আছে কি না
    return this.prisma.product.update({
      where: { id },
      data: { ...dto, ...(imageUrl && { image: imageUrl }) },
    });
  }

  // ৫. ডিলিট করা
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}