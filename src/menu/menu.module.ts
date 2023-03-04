import { Module } from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { MenuController } from './controllers/menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './entity/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService],
})
export class MenuModule {}
