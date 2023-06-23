import {
  Resource_User,
  Resource_UserDocument,
} from './resources-users/schemas/resources-user';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Groupsresources,
  GroupsresourcesDocument,
} from './groups-resources/schemas/groups-resources.schema';
import {
  CATEGORIA_1,
  CATEGORIA_2,
  CATEGORIA_3,
  CATEGORIA_4,
  MOD_PRINCIPAL,
  RECURSOS_DEFECTOS,
  ROL_PRINCIPAL,
} from './lib/const/consts';
import { Resource, ResourceDocument } from './resource/schemas/resource.schema';
import { Role, RoleDocument } from './role/schemas/role.schema';
import { User, UserDocument } from './user/schemas/user.schema';
import { Menu, MenuDocument } from './menu/schemas/menu.schema';
import { Module, ModuleDocument } from './module/schemas/module.schema';
import { hashPassword } from './lib/helpers/auth.helper';
import {
  Services_User,
  Services_UserDocument,
} from './services-users/schemas/services-user';
import {
  Resource_Role,
  Resource_RoleDocument,
} from './resources-roles/schemas/resources-role';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Groupsresources.name)
    private groupModel: Model<GroupsresourcesDocument>,
    @InjectModel(Resource.name)
    private resourceModel: Model<ResourceDocument>,
    @InjectModel(Resource_User.name)
    private ruModel: Model<Resource_UserDocument>,
    @InjectModel(Resource_Role.name)
    private rrModel: Model<Resource_RoleDocument>,
    @InjectModel(Role.name)
    private rolModel: Model<RoleDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Menu.name)
    private menuModel: Model<MenuDocument>,
    @InjectModel(Module.name)
    private moduleModel: Model<ModuleDocument>,
    @InjectModel(Services_User.name)
    private suModel: Model<Services_UserDocument>,
  ) {}

  async onApplicationBootstrap() {
    await this.init();
  }

  private async init() {
    //Evitamos doble registro
    const count = await this.userModel.estimatedDocumentCount();
    if (count > 0) return;

    //Crea las categorias por defecto
    await Promise.all([
      new this.groupModel({
        name: CATEGORIA_1,
      }).save(),
      new this.groupModel({
        name: CATEGORIA_2,
      }).save(),
      new this.groupModel({
        name: CATEGORIA_3,
      }).save(),
      new this.groupModel({
        name: CATEGORIA_4,
      }).save(),
    ]);

    //Busca todas las categorias ingresadas
    const categorys = await this.groupModel.find();

    //Recorremos los recursos defatuls con las categorias insertadas para obtener las id
    const mapped = RECURSOS_DEFECTOS.map((obj) => {
      const item = categorys.find((cat) => cat.name === obj.group_resource);
      return item ? { ...obj, group_resource: item._id } : obj;
    });

    //Guardamos los recursos
    await this.resourceModel.insertMany(mapped);

    //Agregamos menus
    const menusToADM = await Promise.all([
      new this.menuModel({
        name: 'Usuarios',
        status: true,
        link: 'usuarios',
      }).save(),
      new this.menuModel({
        name: 'Roles',
        status: true,
        link: 'roles',
      }).save(),
      new this.menuModel({
        name: 'Modulos',
        status: true,
        link: 'modulos',
      }).save(),
      new this.menuModel({
        name: 'Permisos',
        status: true,
        link: 'permisos',
      }).save(),
    ]);

    //Agregamos modulos
    const modulesToADM = await Promise.all([
      new this.moduleModel({
        name: MOD_PRINCIPAL,
        status: true,
        menu: menusToADM,
        creator: null,
      }).save(),
      new this.moduleModel({
        name: 'Ventas',
        status: true,
        creator: null,
      }).save(),
      new this.moduleModel({
        name: 'Almacen',
        status: true,
        creator: null,
      }).save(),
    ]);

    //Agregamos rol
    const rol = new this.rolModel({
      name: ROL_PRINCIPAL,
      status: true,
      module: modulesToADM,
      creator: null,
    }).save();

    //Agregamos usuario
    const passwordHashed = await hashPassword('admin123');
    const user = new this.userModel({
      name: 'DAVIS KEINER',
      lastname: 'PEREZ GUZMAN',
      tipDocument: 'DNI',
      nroDocument: '99999999',
      email: 'admin@admin.com.pe',
      username: 'admin',
      password: passwordHashed,
      status: true,
      role: await rol,
      creator: null,
    }).save();

    //Obtenemos id de recursos x defectos
    const keys = RECURSOS_DEFECTOS.map((res) => res.key);
    const findResources = await this.resourceModel.find({
      key: { $in: keys },
      status: true,
    });

    const getIdsResources = findResources.map((res) => res._id);

    //Agregamos recursos al usuario
    new this.ruModel({
      user: await user,
      resource: getIdsResources,
      status: true,
    }).save();

    //Agregamos recursos al rol
    new this.rrModel({
      role: await rol,
      resource: getIdsResources,
      status: true,
    }).save();

    //Agregamos los servicios al usuario
    new this.suModel({
      status: true,
      module: modulesToADM,
      user: await user,
    }).save();
  }

  getHello(): string {
    return 'API funcionando correctamente!!';
  }
}
