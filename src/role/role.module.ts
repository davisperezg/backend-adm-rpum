import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu, MenuSchema } from 'src/menu/schemas/menu.schema';
import { MenuService } from 'src/menu/services/menu.service';
import { ModuleModule } from 'src/module/module.module';
import {
  ModuleSchema,
  Module as ModuleEntity,
} from 'src/module/schemas/module.schema';
import { ModuleService } from 'src/module/services/module.service';
import { PermisosRolEntity } from 'src/resources-roles/entity/recursos-roles.entity';
import {
  Resource_Role,
  Resource_RoleSchema,
} from 'src/resources-roles/schemas/resources-role';
import { PermisosUserEntity } from 'src/resources-users/entity/recursos-users.entity';
import {
  Resource_User,
  Resource_UserSchema,
} from 'src/resources-users/schemas/resources-user';
import { AuxServicesUserEntity } from 'src/services-users/entity/cp-servicios.user.entity';
import { ServicesUserEntity } from 'src/services-users/entity/servicios-user.entity';
import {
  CopyServicesSchema,
  CopyServices_User,
} from 'src/services-users/schemas/cp-services-user';
import {
  ServicesUserSchema,
  Services_User,
} from 'src/services-users/schemas/services-user';
import { ServicesUsersService } from 'src/services-users/services/services-users.service';
import { UserEntity } from 'src/user/enitty/user.entity';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/services/user.service';
import { RoleController } from './controllers/role.controller';
import { RolEntity } from './entity/rol.entity';
import { Role, RoleSchema } from './schemas/role.schema';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Role.name, schema: RoleSchema },
    //   { name: Resource_User.name, schema: Resource_UserSchema },
    //   { name: Resource_Role.name, schema: Resource_RoleSchema },
    //   { name: User.name, schema: UserSchema },
    //   { name: Services_User.name, schema: ServicesUserSchema },
    //   { name: CopyServices_User.name, schema: CopyServicesSchema },
    //   { name: ModuleEntity.name, schema: ModuleSchema },
    //   { name: Menu.name, schema: MenuSchema },
    // ]),
    TypeOrmModule.forFeature([
      RolEntity,
      PermisosUserEntity,
      PermisosRolEntity,
      UserEntity,
      AuxServicesUserEntity,
      ServicesUserEntity,
    ]),
    //forwardRef(() => ModuleModule),
    ModuleModule,
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    // ModuleService,
    // MenuService,
    // ServicesUsersService,
    // UserService,
  ],
  exports: [RoleService],
})
export class RoleModule {}
