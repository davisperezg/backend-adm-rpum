import { UpdateModuloDTO } from './../dto/update-modulo';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module, ModuleDocument } from '../schemas/module.schema';
import { Model } from 'mongoose';
import { MenuService } from 'src/menu/services/menu.service';
import { RoleDocument } from 'src/role/schemas/role.schema';
import { ServicesUsersService } from 'src/services-users/services/services-users.service';
import { UserService } from 'src/user/services/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuloEntity } from '../entity/modulo.entity';
import { Repository, In } from 'typeorm';
import { CreateModuloDTO } from '../dto/create-modulo';
import { QueryModulo } from '../dto/query-modulo';
import { MOD_PRINCIPAL, ROL_PRINCIPAL } from 'src/lib/const/consts';

@Injectable()
export class ModuleService {
  constructor(
    // @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    // @InjectModel('Role') private roleModel: Model<RoleDocument>,
    // private readonly menuService: MenuService,
    // @Inject(forwardRef(() => ServicesUsersService))
    // private readonly suService: ServicesUsersService,
    // private readonly userService: UserService,
    @InjectRepository(ModuloEntity)
    private moduleModel: Repository<ModuloEntity>,
    private menuService: MenuService,
  ) {}

  // async onApplicationBootstrap() {
  //   const count = await this.moduleModel.estimatedDocumentCount();
  //   if (count > 0) return;
  //   try {
  //     //ADD MODULES
  //     const getMenus = await this.menuService.findbyName([
  //       'Usuarios',
  //       'Roles',
  //       'Modulos',
  //       'Permisos',
  //     ]);

  //     const findMenus = getMenus.map((men) => men._id);

  //     await Promise.all([
  //       new this.moduleModel({
  //         name: 'Administración de sistema - PRINCIPAL',
  //         status: true,
  //         menu: findMenus,
  //         creator: null,
  //       }).save(),
  //       new this.moduleModel({
  //         name: 'Perfiles',
  //         status: true,
  //         creator: null,
  //       }).save(),
  //       new this.moduleModel({
  //         name: 'Tickets',
  //         status: true,
  //         creator: null,
  //       }).save(),
  //     ]);

  //     //ADD ROL
  //     const getModules = await this.findbyNames([
  //       'Administración de sistema - PRINCIPAL',
  //       'Perfiles',
  //       'Tickets',
  //     ]);

  //     await Promise.all([
  //       new this.roleModel({
  //         name: 'OWNER',
  //         status: true,
  //         module: getModules,
  //         creator: null,
  //       }).save(),
  //     ]);

  //     const findOwner = await this.roleModel.findOne({ name: 'OWNER' });

  //     setTimeout(async () => {
  //       const findUser = await this.userService.findUserByIdRol(findOwner._id);
  //       const dataUser = {
  //         user: findUser._id,
  //         module: getModules,
  //       };

  //       await this.suService.create(dataUser);
  //     }, 15000);
  //   } catch (e) {
  //     throw new Error(`Error en ModuleService.onModuleInit ${e}`);
  //   }
  // }

  //lista los modulos en roles
  async findAll(user?: any): Promise<Module[] | any> {
    //   const { findUser } = user;
    //   let formated = [];
    //   if (findUser.role === 'OWNER') {
    //     const modules = await this.moduleModel
    //       .find({
    //         $or: [{ creator: findUser._id }, { creator: null }],
    //       })
    //       .populate({
    //         path: 'menu',
    //       });

    //     formated = modules
    //       .map((mod) => {
    //         if (mod.name === 'Administración de sistema - PRINCIPAL') {
    //           return {
    //             label: mod.name,
    //             value: mod._id,
    //             disabled: true,
    //           };
    //         } else {
    //           return {
    //             label: mod.name,
    //             value: mod._id,
    //             disabled: mod.status ? false : true,
    //           };
    //         }
    //       })
    //       .sort((a, b) => {
    //         if (a > b) {
    //           return 1;
    //         }
    //         if (a < b) {
    //           return -1;
    //         }
    //         // a must be equal to b
    //         return 0;
    //       });
    //   } else {
    //     const modulesCreateds = await this.moduleModel
    //       .find({
    //         creator: findUser._id,
    //       })
    //       .populate({
    //         path: 'menu',
    //       });

    //     const myModulesAssigneds = await this.suService.findModulesByUser(
    //       findUser._id,
    //     );

    //     const modules = myModulesAssigneds.concat(modulesCreateds);

    //     formated = modules
    //       .map((mod) => ({
    //         label: mod.name,
    //         value: mod._id,
    //         disabled: mod.status ? false : true,
    //       }))
    //       .sort((a, b) => {
    //         if (a > b) {
    //           return 1;
    //         }
    //         if (a < b) {
    //           return -1;
    //         }
    //         // a must be equal to b
    //         return 0;
    //       });
    //   }

    //   return formated;
    return;
  }

  // //lista los modulos en el crud
  async listModules(user?: any): Promise<QueryModulo[]> {
    //   const { findUser } = user;
    let modules = [];
    //   if (findUser.role === 'OWNER') {
    //     modules = await this.moduleModel
    //       .find({
    //         $or: [{ creator: null }, { creator: findUser._id }],
    //       })
    //       .populate({
    //         path: 'menu',
    //       });
    //   } else {
    try {
      modules = await this.moduleModel.find({
        relations: ['menus'],
        order: {
          nombre: 'ASC',
        },
        where: {
          estado: true,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar listar modulos - Informar cod_error: ModuleService.listModules.find2',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    //     const modulesByCreator = await this.moduleModel
    //       .find({
    //         creator: findUser._id,
    //       })
    //       .populate({
    //         path: 'menu',
    //       });

    //     modules = modulesByCreator;
    //   }

    return modules;
  }

  async validarModulosEntrantes(idsModulos: number[]): Promise<ModuloEntity[]> {
    let modulos = [];
    let validarLista: boolean;

    try {
      const listaModulos = await this.moduleModel.findBy({
        id: In(idsModulos),
      });
      const idsListaModulos = listaModulos.map((a) => a.id);
      validarLista = idsModulos.every((x) => idsListaModulos.includes(x));

      modulos = listaModulos;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar obtener ids de modulos - Informar cod_error: ModuloService.validarModulosEntrantes.findBy',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //Si es false = se encontro un 1 o mas modulos no registrado en el body
    if (!validarLista)
      throw new HttpException(
        'Se encontró modulo(s) no disponible',
        HttpStatus.BAD_REQUEST,
      );

    return modulos;
  }

  async buscarModuloXid(
    id: number,
    usoInterno?: boolean,
  ): Promise<QueryModulo> {
    let existeModulo: any = {};

    try {
      existeModulo = await this.moduleModel.findOne({
        relations: ['menus'],
        where: {
          id: id,
          estado: true,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar obtener id del modulo - Informar cod_error: ModuleService.buscarModuloXid.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!existeModulo)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'El modulo no existe o está inactivo.',
        },
        HttpStatus.BAD_REQUEST,
      );

    const queryModulo: QueryModulo = {
      id: existeModulo.id,
      nombre: existeModulo.nombre,
      detalle: existeModulo.detalle,
      link: existeModulo.link,
      color: existeModulo.color,
      icon: existeModulo.icon,
      estado: existeModulo.estado,
      fecha_creada: existeModulo.createdAt,
      fecha_modificada: existeModulo.updatedAt,
      menus: existeModulo.menus.map((a) => {
        return {
          nombre: a.nombre,
          id: a.id,
        };
      }),
    };

    if (usoInterno) {
      queryModulo['duenio'] = 'x';
    }

    return queryModulo;
  }

  async buscarModulosXid_Xestado(id: number, estado: boolean) {
    try {
      return await this.moduleModel.findOne({
        where: {
          id: id,
          estado: estado,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar un modulo - Informar cod_error: ModuleService.buscarModulosActivosXid.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validarExisteRepetidos(nombre: string, link: string) {
    let moduloExiste = {};

    try {
      moduloExiste = await this.moduleModel.findOne({
        where: [{ nombre: nombre }, { link: link }],
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un modulo - Informar cod_error: ModuleService.validarRepetidos.findOne1',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (moduloExiste) {
      const data = moduloExiste as ModuloEntity;

      const nombreEncontradoDB =
        data.nombre && data.nombre.trim().toLowerCase();
      const linkEncontradoDB = data.link && data.link.trim().toLowerCase();

      if (nombreEncontradoDB === nombre.trim().toLowerCase()) {
        throw new HttpException(
          `El nombre del módulo ya existe`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (linkEncontradoDB === link.trim().toLowerCase()) {
        throw new HttpException(
          `El link del módulo ya existe`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  validarIngresoMenuOrLink(menus: number[], link: string) {
    if (menus && menus.length > 0 && link) {
      throw new HttpException(
        'Estas ingresando link y menus, el modulo solo puede tener uno o varios menus ó un link directo',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // //Add a single module
  async create(createModulo: CreateModuloDTO, user?: any) {
    const { nombre, menus, color, detalle, icon, link } = createModulo;
    //   const { findUser } = user;

    await this.validarExisteRepetidos(nombre, link);

    //Validar de que cada usuario puede tener un modulo propio
    //quiere decir que user1 puede tener mod1 y user2 tambien mod1

    //El modulo solo puede tener link directo o menus, no puede existir ambos
    this.validarIngresoMenuOrLink(menus, link);

    const listaMenus =
      menus && !link ? await this.menuService.findByIds(menus) : null;

    try {
      const nuevoModulo = new ModuloEntity();
      nuevoModulo.nombre = nombre;
      nuevoModulo.detalle = detalle;
      nuevoModulo.color = color;
      nuevoModulo.icon = icon;
      nuevoModulo.link = link;
      nuevoModulo.menus = listaMenus;
      return await this.moduleModel.save(nuevoModulo);
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un modulo - Informar cod_error: ModuleService.create.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // //Put a single module
  async update(
    id: number,
    bodyModule: UpdateModuloDTO,
    ip?: string,
    user?: any,
  ) {
    const { nombre, menus, link } = bodyModule;
    //   const { findUser } = user;

    //Para actualizar un modulo debe de tener el estado "habiliado" o debe de existir
    await this.buscarModuloXid(id, true);

    //El modulo solo puede tener link directo o menus, no puede existir ambos
    this.validarIngresoMenuOrLink(menus, link);

    const listaMenus =
      menus && !link ? await this.menuService.findByIds(menus) : null;

    const modulo = await this.moduleModel.findOne({
      where: { id },
    });

    try {
      const data_modificar = {
        ...bodyModule,
        menus: listaMenus,
      };

      this.moduleModel.merge(modulo, data_modificar);

      return await this.moduleModel.save(modulo);
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar actualizar un modulo - Informar cod_error: ModuleService.update.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Delete a single module
  async delete(id: number): Promise<boolean> {
    let result = false;

    //el modulo as-principal no se puede eliminar
    const dataModulo = await this.buscarModulosXid_Xestado(id, true);

    if (!dataModulo)
      throw new HttpException(
        'El módulo ya ha sido deshabilitado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (dataModulo.nombre === MOD_PRINCIPAL)
      throw new HttpException(
        'Estas intentando una accion incorrecta, capturamos tu ip para nuestra seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );

    try {
      const updateModulo = Object.assign(dataModulo, { estado: false });

      await this.moduleModel.save(updateModulo);
      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar deshablitar un modulo - Informar cod_error: ModuleService.delete.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  // //Restore a single module
  async restore(id: number): Promise<boolean> {
    let result = false;

    const dataModulo = await this.buscarModulosXid_Xestado(id, false);

    if (!dataModulo)
      throw new HttpException(
        'El módulo ya ha sido habiliado',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const updateModulo = Object.assign(dataModulo, { estado: true });

      await this.moduleModel.save(updateModulo);
      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar habilitar un modulo - Informar cod_error: ModuleService.restore.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findModulesIds(number: any[]) {
    return [];
  }
}
