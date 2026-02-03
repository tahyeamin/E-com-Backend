import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // অন্য মডিউলে ইউজার সার্ভিস লাগলে এটি কাজে দেবে
})
export class UserModule {}