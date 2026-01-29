import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; // প্রিজমা অবশ্যই লাগবে ডাটাবেসের জন্য

@Module({
  imports: [PrismaModule], // ডাটাবেস এক্সেসের জন্য প্রিজমা ইম্পোর্ট করা হলো
  controllers: [ProductsController], // কন্ট্রোলার রুটগুলো হ্যান্ডেল করবে
  providers: [ProductsService], // সার্ভিসে আমাদের সব বিজনেস লজিক থাকবে
})
export class ProductsModule {}