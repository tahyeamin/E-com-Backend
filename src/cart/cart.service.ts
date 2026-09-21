import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}


  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }
    return cart;
  }

  
  async addToCart(userId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);
    
   
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });
  }


  async updateQuantity(cartItemId: number, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true }
    });

    if (!item) throw new NotFoundException('Item not found');

   
    if (quantity > item.product.stock) {
      throw new BadRequestException('Sorry, Out of Stock');
    }

    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: Number(quantity) },
    });
  }

  
  async removeItem(cartItemId: number) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }
}
