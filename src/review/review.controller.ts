import { Controller, Post, Body, Get, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':productId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() req,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview(req.user.userId, productId, dto);
  }

  @Get(':productId')
  findAll(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getProductReviews(productId);
  }
}