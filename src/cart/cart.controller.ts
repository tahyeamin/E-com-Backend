import { Controller, Post, Body, Get, UseGuards, Req, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // তোমার প্রজেক্টের পাথ অনুযায়ী চেক করো

@Controller('cart')
@UseGuards(JwtAuthGuard) // কার্ট ব্যবহারের জন্য লগইন থাকতে হবে
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // কার্টে অ্যাড করা
  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  // কার্ট দেখা
  @Get()
  getCart(@Req() req) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  // পরিমাণ আপডেট করা (তুমি যেটা খুঁজছিলে)
  @Patch('update/:id')
  updateCart(
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(cartItemId, quantity);
  }

  // আইটেম মুছে ফেলা
  @Delete('item/:id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }
}