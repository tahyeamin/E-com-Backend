import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: number, dto: CreateOrderDto) {
   
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('আপনার কার্ট খালি!');
    }

    
    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

   
    return this.prisma.$transaction(async (tx) => {
   
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          address: dto.address,
          phone: dto.phone,
          status: 'PENDING',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, 
            })),
          },
        },
        include: { items: true },
      });

      
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(`${item.product.name} পর্যাপ্ত স্টকে নেই!`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }, 
        });
      }

      
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return order;
    });
  }

  
  async getUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
