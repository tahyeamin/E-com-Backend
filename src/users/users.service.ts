import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client'; // Prisma থেকে সরাসরি Enum ইম্পোর্ট করতে হবে

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // সব ইউজার লিস্ট পাওয়ার জন্য
  async getAllUsers() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // রোল আপডেট করার ফাংশন (আপনার স্কিমা অনুযায়ী)
  async updateUserRole(userId: string, newRole: string) {
    // ১. আপনার স্কিমাতে id হলো Int, তাই স্ট্রিংকে নাম্বারে কনভার্ট করতে হবে
    const idAsNumber = parseInt(userId);

    // ২. চেক করা ইউজার ডাটাবেজে আছে কি না
    const user = await this.prisma.user.findUnique({ 
      where: { id: idAsNumber } 
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // ৩. রোল আপডেট করা (Enum টাইপ কাস্টিং সহ)
    return await this.prisma.user.update({
      where: { id: idAsNumber },
      data: { 
        // newRole কে Role Enum হিসেবে পাস করতে হবে
        role: newRole as Role 
      },
    });
  }

  async getAdminStats() {
  // প্রিজমার count() ফাংশন ব্যবহার করে মোট সংখ্যা বের করা
  const [userCount, productCount, orderCount] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.category.count(), // অথবা product.count() আপনার স্কিমা অনুযায়ী
    this.prisma.order.count(),
  ]);

  return {
    users: userCount,
    products: productCount,
    orders: orderCount,
    revenue: 0, // রেভিনিউ লজিক পরে অ্যাড করা যাবে
  };
}

async deleteUser(userId: string) {
  const idAsNumber = parseInt(userId);
  
  // চেক করা ইউজারটি আসলেই আছে কি না
  const user = await this.prisma.user.findUnique({ where: { id: idAsNumber } });
  if (!user) throw new NotFoundException('User not found');

  return await this.prisma.user.delete({
    where: { id: idAsNumber },
  });
}
}