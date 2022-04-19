import {
  Resource_User,
  Resource_UserSchema,
} from './../resources-users/schemas/resources-user';
import { Module } from '@nestjs/common';
import { ResourcesRolesService } from './services/resources-roles.service';
import { ResourcesRolesController } from './controllers/resources-roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource_Role, Resource_RoleSchema } from './schemas/resources-role';
import { Role, RoleSchema } from 'src/role/schemas/role.schema';
import { Resource, ResourceSchema } from 'src/resource/schemas/resource.schema';
import { ResourceService } from 'src/resource/services/resource.service';
import { RoleService } from 'src/role/services/role.service';
import {
  Module as ModuleE,
  ModuleSchema,
} from 'src/module/schemas/module.schema';
import { ModuleService } from 'src/module/services/module.service';
import { Menu, MenuSchema } from 'src/menu/schemas/menu.schema';
import { MenuService } from 'src/menu/services/menu.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/services/user.service';
import { ResourcesUsersService } from 'src/resources-users/services/resources-users.service';
import {
  CopyResource_User,
  CopyResource_UserSchema,
} from 'src/resources-users/schemas/cp-resource-user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource_Role.name, schema: Resource_RoleSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Resource.name, schema: ResourceSchema },
      { name: ModuleE.name, schema: ModuleSchema },
      { name: Menu.name, schema: MenuSchema },
      { name: User.name, schema: UserSchema },
      { name: Resource_User.name, schema: Resource_UserSchema },
      { name: CopyResource_User.name, schema: CopyResource_UserSchema },
    ]),
  ],
  providers: [
    ResourcesRolesService,
    ResourceService,
    RoleService,
    ModuleService,
    MenuService,
    UserService,
    ResourcesUsersService,
  ],
  controllers: [ResourcesRolesController],
})
export class ResourcesRolesModule {}
