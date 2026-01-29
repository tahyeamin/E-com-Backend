import { Controller, Post, Body, UseInterceptors, UploadedFile, UseGuards, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads', // আপনার প্রোজেক্ট রুটে 'uploads' ফোল্ডার থাকতে হবে
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateProductDto) {
    const imageUrl = `/uploads/${file.filename}`;
    return this.productsService.create(dto, imageUrl);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}