import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(userId: number, productId: number, dto: CreateReviewDto) {
    // চেক করা হচ্ছে ইউজার আগে রিভিউ দিয়েছে কি না
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existingReview) {
      throw new BadRequestException('আপনি ইতিমধ্যে এই প্রোডাক্টে রিভিউ দিয়েছেন!');
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });
  }

  async getProductReviews(productId: number) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { name: true } }, // শুধু ইউজারের নাম দেখাবে
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}