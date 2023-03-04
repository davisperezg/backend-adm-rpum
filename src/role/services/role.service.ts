import { CopyServicesDocument } from './../../services-users/schemas/cp-services-user';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import {
  Resource_User,
  Resource_UserDocument,
} from 'src/resources-users/schemas/resources-user';
import {
  Resource_Role,
  Resource_RoleDocument,
} from 'src/resources-roles/schemas/resources-role';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  Services_User,
  Services_UserDocument,
} from 'src/services-users/schemas/services-user';
import { CopyServices_User } from 'src/services-users/schemas/cp-services-user';
import { ModuleService } from 'src/module/services/module.service';
import { InjectRepository } from '@nestjs/typeorm';
import { RolEntity } from '../entity/rol.entity';
import { Repository } from 'typeorm';
import { CreateRolDTO } from '../dto/create-rol';
import { MOD_PRINCIPAL, ROL_PRINCIPAL } from 'src/lib/const/consts';
import { QueryRol } from '../dto/query-rol';
import { UpdateRolDTO } from '../dto/update-rol';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RolEntity)
    private roleModel: Repository<RolEntity>,
    private moduloService: ModuleService, // @InjectModel(Role.name) private roleModel: Model<RoleDocument>, // @InjectModel(Resource_User.name) // private ruModel: Model<Resource_UserDocument>, // @InjectModel(Resource_Role.name) // private rrModel: Model<Resource_RoleDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>, // @InjectModel(Services_User.name) // private suModel: Model<Services_UserDocument>, // @InjectModel(CopyServices_User.name) // private copySUModel: Model<CopyServicesDocument>, // @Inject(forwardRef(() => ModuleService)) // private readonly moduleService: ModuleService,
  ) {}

  //Add a single role
  async create(createRole: CreateRolDTO, userToken?: any) {
    const { modulos, nombre } = createRole;
    //   const { findUser } = userToken;

    //Valida si los modulos existen o no, si es no muestra error
    const listaModulos = await this.moduloService.validarModulosEntrantes(
      modulos,
    );

    const moduloProhibido = listaModulos.some(
      (a) => a.nombre === MOD_PRINCIPAL,
    );

    if (moduloProhibido) {
      throw new HttpException(
        'Estas intentado un acción prohibida, para nuestra seguridad tomaremos tu dirección ip',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    //   const findRoles = await this.roleModel.find({ name });
    //   const getRolByCreator = findRoles.find(
    //     (role) => String(role.creator) === String(findUser._id),
    //   );
    //   //Si encuentra el rol y es el mismo rol que ha creado el creador se valida y muestra mensaje
    //   if (getRolByCreator) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.BAD_REQUEST,
    //         type: 'BAD_REQUEST',
    //         message: `El rol ${name} ya existe.`,
    //       },
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }

    let rolRegistrado = {};
    try {
      const enviarData: RolEntity = {
        ...createRole,
        modulos: listaModulos,
        //creator: findUser._id,
      };

      const nuevoRol = this.roleModel.create(enviarData);
      rolRegistrado = await this.roleModel.save(nuevoRol);
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un modulo - Informar cod_error: RolService.create.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //   //cualquier rol que es creado obtendra los permisos del usuario padre o de lo contrario todos los permisos
    //   const findRU = await this.ruModel.findOne({ user: findUser._id });
    //   await new this.rrModel({
    //     role: createdRole._id,
    //     status: true,
    //     resource: findRU.resource,
    //   }).save();

    return rolRegistrado;
  }

  //Put a single role
  async update(id: number, bodyRole: UpdateRolDTO, user?: any) {
    const { modulos, nombre } = bodyRole;

    const rol = await this.roleModel.findOne({ where: { id } });

    //Valida si los modulos existen o no, si es no muestra error
    const listaModulos = await this.moduloService.validarModulosEntrantes(
      modulos,
    );

    const moduloProhibido = listaModulos.some(
      (a) => a.nombre === MOD_PRINCIPAL,
    );

    //Ningun rol puede modificar el rol OWNER ni ninguno puede poner el nombre OWNER, tampo pueden usar el modulo prohibido
    if (
      (rol.nombre === ROL_PRINCIPAL &&
        String(nombre).toUpperCase().trim() !== ROL_PRINCIPAL) ||
      (rol.nombre !== ROL_PRINCIPAL &&
        String(nombre).toUpperCase().trim() === ROL_PRINCIPAL) ||
      (rol.nombre === ROL_PRINCIPAL && !moduloProhibido) ||
      (rol.nombre !== ROL_PRINCIPAL && moduloProhibido)
    ) {
      throw new HttpException(
        'Estas intentando una accion incorrecta, para nuestra seguridad capturamos tu ip',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    //   const findRoleRep = await this.roleModel.findOne({ name });
    //   //Si actualizan el nombre primero buscamos si el rol actualizando ya existe.
    //   if (findRoleRep && findRoleRep.name !== findRole.name) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.BAD_REQUEST,
    //         type: 'BAD_REQUEST',
    //         message: 'El rol ya existe.',
    //       },
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }

    //   const users = await this.findUsersWithOneRole_Local(id);

    //   if (users.length > 0) {
    //     const arrayOfStringIds = users.map((format) => format._id);
    //     const findCopysSU = await this.copySUModel.find({ status: true });

    //     const modificados = [];
    //     users.filter((a) => {
    //       findCopysSU.filter((x) => {
    //         if (String(x.user) === String(a._id)) {
    //           modificados.push(a);
    //         }
    //       });
    //     });

    //     const noModificados = users.filter((fil) => !modificados.includes(fil));

    //     noModificados.map(async (noMod) => {
    //       //actualiza los mismo recursos enviados al rol hacia los usuarios que contienen el rol
    //       await this.suModel.findOneAndUpdate(
    //         {
    //           user: noMod._id,
    //           //resources: { $elemMatch: { userUpdated: false } },
    //         },
    //         { $set: { module: module } },
    //         { new: true },
    //       );
    //     });

    //     const findRUModifieds = await this.copySUModel.find({
    //       user: { $in: arrayOfStringIds },
    //     });

    //     const dataSUMofied = findRUModifieds.map(async (ru) => {
    //       const enru = await this.suModel.findOne({
    //         user: ru.user,
    //         status: true,
    //       });

    //       const buscarModificadosARU = enru.module.filter((t) =>
    //         ru.module.includes(t),
    //       );

    //       return {
    //         module: module
    //           .filter(
    //             (res: any) => !ru.module.map((a) => String(a)).includes(res),
    //           )
    //           .concat(buscarModificadosARU),
    //         user: ru.user,
    //       };
    //     });

    //     dataSUMofied.map(async (data) => {
    //       await this.suModel.findOneAndUpdate(
    //         { user: (await data).user },
    //         {
    //           module: (await data).module,
    //         },
    //         { new: true },
    //       );
    //     });
    //   }

    const enviar_modificar = {
      ...bodyRole,
      modulos: listaModulos,
    };

    this.roleModel.merge(rol, enviar_modificar);
    return await this.roleModel.save(rol);
  }

  //Restore a single role
  async restore(id: number): Promise<boolean> {
    let result = false;

    const dataRol = await this.buscarRolXid_Xestado(id, false);

    if (!dataRol)
      throw new HttpException(
        'El rol ya ha sido habiliado',
        HttpStatus.BAD_REQUEST,
      );

    try {
      this.roleModel.merge(dataRol, { estado: true });
      await this.roleModel.save(dataRol);
      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar habilitar un rol - Informar cod_error: RolService.restore.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  // //Delete a single role
  async delete(id: number): Promise<boolean> {
    let result = false;

    const dataRol = await this.buscarRolXid_Xestado(id, true);

    if (!dataRol)
      throw new HttpException(
        'El rol ya ha sido deshabilitado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    if (dataRol.nombre === ROL_PRINCIPAL)
      throw new HttpException(
        'Estas intentando una accion incorrecta, capturamos tu ip para nuestra seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );

    try {
      this.roleModel.merge(dataRol, { estado: false });
      await this.roleModel.save(dataRol);
      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar deshablitar un rol - Informar cod_error: RolService.delete.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async findAll(user?: any) {
    // const { findUser } = user;
    let listRoles: RolEntity[] = [];

    // //Solo el owner puede ver todos lo roles
    // if (findUser.role === 'OWNER') {
    const rolesFindDb = await this.roleModel.find({
      relations: ['modulos'],
    });
    listRoles = rolesFindDb;
    // } else {
    //   //Cualquier otro usuario puede ver sus roles creados por el mismo
    //   const rolesFindDb = await this.roleModel
    //     .find({ creator: findUser._id })
    //     .populate([
    //       {
    //         path: 'module',
    //       },
    //       {
    //         path: 'creator',
    //       },
    //     ]);
    //   listRoles = rolesFindDb.filter((role) => role.name !== 'OWNER');
    // }

    // //console.log(listRoles);
    const sentToFront: QueryRol[] = listRoles.map((rol) => {
      return {
        id: rol.id,
        nombre: rol.nombre,
        estado: rol.estado,
        detalle: rol.detalle,
        // creator: rol.creator
        //   ? rol.creator.name + ' ' + rol.creator.lastname
        //   : 'NINGUNO',
        fecha_creada: rol.createdAt,
        fecha_modificada: rol.updatedAt,
        modulos: rol.modulos.map((a) => {
          return {
            id: a.id,
            nombre: a.nombre,
          };
        }),
      };
    });

    return sentToFront;
  }

  async findOneCreator(role: string) {
    //return await this.roleModel.findById(role).populate('creator');
    return;
  }

  async buscarRolXId(id: number, user?: any, usoInterno?: boolean) {
    let existeRol: any = {};

    try {
      existeRol = await this.roleModel.findOne({
        relations: ['modulos'],
        where: {
          id: id,
          estado: true,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar obtener id del rol - Informar cod_error: RolService.buscarRolXId.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!existeRol)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'El rol no existe o está inactivo.',
        },
        HttpStatus.BAD_REQUEST,
      );

    const queryRol: QueryRol = {
      id: existeRol.id,
      nombre: existeRol.nombre,
      detalle: existeRol.detalle,
      estado: existeRol.estado,
      fecha_creada: existeRol.createdAt,
      fecha_modificada: existeRol.updatedAt,
      modulos: existeRol.modulos.map((a) => {
        return {
          nombre: a.nombre,
          id: a.id,
        };
      }),
    };

    if (usoInterno) {
      queryRol['duenio'] = 'x';
    }

    return queryRol;
  }

  async findRoleById(aa: any): Promise<any> {
    return;
  }

  async findRoleByName(role: string): Promise<RoleDocument> {
    // const rol = await this.roleModel.findOne({ name: role, status: true });

    // if (!rol) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.BAD_REQUEST,
    //       type: 'BAD_REQUEST',
    //       message: 'El rol está inactivo.',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // return rol;
    return;
  }

  async findRoleByNames(name: string[]): Promise<RoleDocument[]> {
    //return await this.roleModel.find({ name: { $in: name }, status: true });
    return;
  }

  async findModulesByOneRol(idRol: string): Promise<RoleDocument> {
    //return await this.roleModel.findById(idRol);
    return;
  }

  async findUsersWithOneRole_Local(idRol: string): Promise<any> {
    //const users = await this.userModel.find({ role: idRol as any });
    //return users;
    return;
  }

  async findOneRolAndUpdateUsersModules_Local(
    isUsers: string[],
  ): Promise<Services_UserDocument[]> {
    // const users = await this.suModel.find({ user: { $in: isUsers as any } });
    // return users;
    return;
  }

  async findRolesWithManyCreators_Local(idCreator: string[]): Promise<any[]> {
    //   const roles = await this.roleModel.find({
    //     creator: { $in: idCreator as any },
    //   });
    //   return roles;
    return;
  }

  async buscarRolXid_Xestado(id: number, estado: boolean) {
    try {
      return await this.roleModel.findOne({
        where: {
          id: id,
          estado: estado,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar un rol - Informar cod_error: RolService.buscarModulosActivosXid.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
