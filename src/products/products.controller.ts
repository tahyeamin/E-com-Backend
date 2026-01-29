import { Controller, Post, Body, UseInterceptors, UploadedFiles, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('image', 10, { // Key নাম হবে 'image'
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@UploadedFiles() files: Express.Multer.File[], @Body() dto: CreateProductDto) {
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);
    return this.productsService.create(dto, imageUrls);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: any, @UploadedFiles() files?: Express.Multer.File[]) {
    const imageUrls = files?.map((file) => `/uploads/${file.filename}`);
    return this.productsService.update(id, dto, imageUrls);
  }

  @Get()
  findAll() { return this.productsService.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.productsService.findOne(id); }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.productsService.remove(id); }
}