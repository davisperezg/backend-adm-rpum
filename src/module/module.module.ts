import {
  CopyServices_User,
  CopyServicesSchema,
} from './../services-users/schemas/cp-services-user';
import { ModuleController } from './controllers/module.controller';
import { ModuleService } from './services/module.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ModuleSchema, Module as ModuleEntity } from './schemas/module.schema';
import { MenuService } from 'src/menu/services/menu.service';
import { Menu, MenuSchema } from 'src/menu/schemas/menu.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/services/user.service';
import { RoleService } from 'src/role/services/role.service';
import { RoleSchema, Role } from 'src/role/schemas/role.schema';
import {
  Resource_Role,
  Resource_RoleSchema,
} from 'src/resources-roles/schemas/resources-role';
import {
  Resource_User,
  Resource_UserSchema,
} from 'src/resources-users/schemas/resources-user';
import {
  ServicesUserSchema,
  Services_User,
} from 'src/services-users/schemas/services-user';
import { ServicesUsersService } from 'src/services-users/services/services-users.service';
import { ModuloEntity } from './entity/modulo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuModule } from 'src/menu/menu.module';
import { ServicesUsersModule } from 'src/services-users/services-users.module';
import { UserModule } from 'src/user/user.module';
import { forwardRef } from '@nestjs/common/utils';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: ModuleEntity.name, schema: ModuleSchema },
    //   { name: Role.name, schema: RoleSchema },
    //   { name: Menu.name, schema: MenuSchema },
    //   { name: CopyServices_User.name, schema: CopyServicesSchema },
    //   { name: Services_User.name, schema: ServicesUserSchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: Resource_User.name, schema: Resource_UserSchema },
    //   { name: Resource_Role.name, schema: Resource_RoleSchema },
    // ]),
    TypeOrmModule.forFeature([ModuloEntity]),
    MenuModule,
    ServicesUsersModule,
  ],
  controllers: [ModuleController],
  providers: [
    ModuleService,
    // MenuService,
    // ServicesUsersService,
    // UserService,
    // RoleService,
  ],
  exports: [ModuleService],
})
export class ModuleModule {}
