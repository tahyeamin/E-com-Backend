import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // প্রিজমা অবশ্যই ইম্পোর্ট করতে হবে
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}