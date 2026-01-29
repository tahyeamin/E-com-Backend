import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ১. প্রোডাক্ট তৈরি (POST)
  async create(dto: CreateProductDto, imageUrls: string[]) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(dto.categoryId) }, // স্ট্রিংকে নাম্বারে কনভার্ট করা হয়েছে
    });

    if (!category) {
      throw new NotFoundException(`Category ID ${dto.categoryId} পাওয়া যায়নি!`);
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description || "",
        price: Number(dto.price), // নিশ্চিত করা হচ্ছে এটি নাম্বার
        stock: Number(dto.stock), // নিশ্চিত করা হচ্ছে এটি নাম্বার
        image: imageUrls,
        categoryId: Number(dto.categoryId), // নিশ্চিত করা হচ্ছে এটি নাম্বার
      },
    });
  }

  // ২. সব প্রোডাক্ট দেখা (GET)
  async findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
    });
  }

  // ৩. নির্দিষ্ট একটি প্রোডাক্ট দেখা (GET Single)
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('প্রোডাক্ট পাওয়া যায়নি!');
    return product;
  }

  // ৪. আপডেট করা (PATCH) - তোমার মেইন সমস্যা এখানে ছিল
  async update(id: number, dto: any, imageUrls?: string[]) {
    // আগে চেক করা প্রোডাক্টটি আছে কি না
    const existingProduct = await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name ?? existingProduct.name,
        description: dto.description ?? existingProduct.description,
        // যদি নতুন ভ্যালু আসে তবে নাম্বার করে বসাবে, নাহলে পুরনোটি থাকবে
        price: dto.price ? Number(dto.price) : existingProduct.price,
        stock: dto.stock ? Number(dto.stock) : existingProduct.stock,
        categoryId: dto.categoryId ? Number(dto.categoryId) : existingProduct.categoryId,
        // নতুন ইমেজ অ্যারে থাকলে আপডেট হবে
        ...(imageUrls && imageUrls.length > 0 && { image: imageUrls }),
      },
    });
  }

  // ৫. ডিলিট করা (DELETE)
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}