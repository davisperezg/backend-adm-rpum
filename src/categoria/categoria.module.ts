import { Module } from '@nestjs/common';
import { CategoriaService } from './services/categoria.service';
import { CategoriaController } from './controllers/categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaPermsisosEntity } from './entity/categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaPermsisosEntity])],
  providers: [CategoriaService],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
