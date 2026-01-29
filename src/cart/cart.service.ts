import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // ইউজারের কার্ট খুঁজে বের করা বা নতুন তৈরি করা
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

  // কার্টে আইটেম যোগ করা (POST)
  async addToCart(userId: number, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);
    
    // প্রোডাক্টটি আগে থেকেই কার্টে আছে কি না চেক করা
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

  // কার্ট আইটেমের কোয়ান্টিটি আপডেট করা (PATCH)
  async updateQuantity(cartItemId: number, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true }
    });

    if (!item) throw new NotFoundException('কার্ট আইটেমটি পাওয়া যায়নি!');

    // স্টক ভ্যালিডেশন
    if (quantity > item.product.stock) {
      throw new BadRequestException('দুঃখিত, পর্যাপ্ত স্টক নেই!');
    }

    if (quantity <= 0) {
      return this.prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: Number(quantity) },
    });
  }

  // কার্ট থেকে আইটেম রিমুভ করা (DELETE)
  async removeItem(cartItemId: number) {
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }
}