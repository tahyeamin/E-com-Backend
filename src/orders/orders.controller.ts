import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(@Req() req, @Body() dto: CreateOrderDto) {
    return this.orderService.checkout(req.user.userId, dto);
  }

  @Get('my-orders')
  getOrders(@Req() req) {
    return this.orderService.getUserOrders(req.user.userId);
  }
}