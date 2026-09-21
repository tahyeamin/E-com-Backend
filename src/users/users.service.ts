import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

 
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

  
  async updateUserRole(userId: string, newRole: string) {
    
    const idAsNumber = parseInt(userId);

    
    const user = await this.prisma.user.findUnique({ 
      where: { id: idAsNumber } 
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

   
    return await this.prisma.user.update({
      where: { id: idAsNumber },
      data: { 
      
        role: newRole as Role 
      },
    });
  }

  async getAdminStats() {
  
  const [userCount, productCount, orderCount] = await Promise.all([
    this.prisma.user.count(),
    this.prisma.category.count(),
    this.prisma.order.count(),
  ]);

  return {
    users: userCount,
    products: productCount,
    orders: orderCount,
    revenue: 0, 
  };
}

async deleteUser(userId: string) {
  const idAsNumber = parseInt(userId);
  
  
  const user = await this.prisma.user.findUnique({ where: { id: idAsNumber } });
  if (!user) throw new NotFoundException('User not found');

  return await this.prisma.user.delete({
    where: { id: idAsNumber },
  });
}
}
