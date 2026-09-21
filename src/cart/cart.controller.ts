import { Controller, Post, Body, Get, UseGuards, Req, Delete, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard) 
export class CartController {
  constructor(private readonly cartService: CartService) {}

 
  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.userId, dto);
  }


  @Get()
  getCart(@Req() req) {
    return this.cartService.getOrCreateCart(req.user.userId);
  }

  
  @Patch('update/:id')
  updateCart(
    @Param('id', ParseIntPipe) cartItemId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(cartItemId, quantity);
  }

 
  @Delete('item/:id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }
}
