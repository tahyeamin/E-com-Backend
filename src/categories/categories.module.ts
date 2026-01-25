import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaModule } from '../prisma/prisma.module'; // এটি ইম্পোর্ট করুন

@Module({
  imports: [PrismaModule], // এখানে PrismaModule অবশ্যই থাকতে হবে
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService], 
})
export class CategoriesModule {}