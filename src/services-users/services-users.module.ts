import { Module } from '@nestjs/common';
import { ServicesUsersService } from './services/services-users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicesUserSchema, Services_User } from './schemas/services-user';
import { ServicesUsersController } from './controllers/services-users.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import {
  ModuleSchema,
  Module as ModuleEntity,
} from 'src/module/schemas/module.schema';
import { UserService } from 'src/user/services/user.service';
import { ModuleService } from 'src/module/services/module.service';
import { Role, RoleSchema } from 'src/role/schemas/role.schema';
import { RoleService } from 'src/role/services/role.service';
import {
  Resource_User,
  Resource_UserSchema,
} from 'src/resources-users/schemas/resources-user';
import {
  Resource_Role,
  Resource_RoleSchema,
} from 'src/resources-roles/schemas/resources-role';
import { Menu, MenuSchema } from 'src/menu/schemas/menu.schema';
import { MenuService } from 'src/menu/services/menu.service';
import {
  CopyServicesSchema,
  CopyServices_User,
} from './schemas/cp-services-user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesUserEntity } from './entity/servicios-user.entity';
import { AuxServicesUserEntity } from './entity/cp-servicios.user.entity';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Services_User.name, schema: ServicesUserSchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: Resource_User.name, schema: Resource_UserSchema },
    //   { name: Resource_Role.name, schema: Resource_RoleSchema },
    //   { name: Role.name, schema: RoleSchema },
    //   { name: CopyServices_User.name, schema: CopyServicesSchema },
    //   { name: ModuleEntity.name, schema: ModuleSchema },
    //   { name: Menu.name, schema: MenuSchema },
    // ]),
    TypeOrmModule.forFeature([ServicesUserEntity, AuxServicesUserEntity]),
  ],
  providers: [
    ServicesUsersService,
    // UserService,
    // ModuleService,
    // RoleService,
    // MenuService,
  ],
  controllers: [ServicesUsersController],
})
export class ServicesUsersModule {}
