import { PermisosUserEntity } from './../../resources-users/entity/recursos-users.entity';
import { QueryToken } from 'src/auth/dto/queryToken';
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
import { In, Repository } from 'typeorm';
import { CreateRolDTO } from '../dto/create-rol';
import { MOD_PRINCIPAL, ROL_PRINCIPAL } from 'src/lib/const/consts';
import { QueryRol } from '../dto/query-rol';
import { UpdateRolDTO } from '../dto/update-rol';
import { PermisosRolEntity } from 'src/resources-roles/entity/recursos-roles.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import { AuxServicesUserEntity } from 'src/services-users/entity/cp-servicios.user.entity';
import { ServicesUserEntity } from 'src/services-users/entity/servicios-user.entity';
import { ModuloEntity } from 'src/module/entity/modulo.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RolEntity)
    private roleModel: Repository<RolEntity>,
    private moduloService: ModuleService,
    @InjectRepository(PermisosUserEntity)
    private ruModel: Repository<PermisosUserEntity>,
    @InjectRepository(PermisosRolEntity)
    private rrModel: Repository<PermisosRolEntity>,
    @InjectRepository(UserEntity)
    private userModel: Repository<UserEntity>,
    @InjectRepository(ServicesUserEntity)
    private suModel: Repository<ServicesUserEntity>,
    @InjectRepository(AuxServicesUserEntity)
    private copySUModel: Repository<AuxServicesUserEntity>, // @InjectModel(Role.name) private roleModel: Model<RoleDocument>, // @InjectModel(Resource_User.name) // private ruModel: Model<Resource_UserDocument>, // @InjectModel(Resource_Role.name) // private rrModel: Model<Resource_RoleDocument>, // @InjectModel(User.name) private userModel: Model<UserDocument>, // @InjectModel(Services_User.name) // private suModel: Model<Services_UserDocument>, // @InjectModel(CopyServices_User.name) // private copySUModel: Model<CopyServicesDocument>, // @Inject(forwardRef(() => ModuleService)) // private readonly moduleService: ModuleService, //@Inject(forwardRef(() => ModuleService))
  ) {}

  //Add a single role
  async create(createRole: CreateRolDTO, userToken: QueryToken) {
    const { modulos, nombre } = createRole;

    const { tokenUsuario, tokenEntityFull } = userToken;

    //Valida si los modulos existen o no, si es no muestra error
    const listaModulos = await this.moduloService.validarModulosEntrantes(
      modulos,
    );

    const moduloProhibido = listaModulos.some(
      (a) => a.nombre === MOD_PRINCIPAL,
    );

    if (
      moduloProhibido ||
      nombre.trim().toLowerCase() === ROL_PRINCIPAL.trim().toLowerCase()
    ) {
      throw new HttpException(
        'Estas intentado un acción prohibida, para nuestra seguridad tomaremos tu dirección ip',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const buscarRoles = await this.roleModel.find({
      relations: { user_create: true },
      where: { nombre },
    });

    const buscarRolXCreador = buscarRoles.find(
      (a) => a.user_create.id === tokenUsuario.id_usuario,
    );

    //Si encuentra el rol y es el mismo rol que ha creado el creador se valida y muestra mensaje
    if (buscarRolXCreador) {
      throw new HttpException('El rol ya existe', HttpStatus.BAD_REQUEST);
    }

    let rolRegistrado = {};
    try {
      const enviarData = {
        ...createRole,
        modulos: listaModulos,
        user_create: tokenEntityFull,
      };

      const nuevoRol = this.roleModel.create(enviarData);
      rolRegistrado = await this.roleModel.save(nuevoRol);
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un modulo - Informar cod_error: RolService.create.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //cualquier rol que es creado obtendra los permisos del usuario padre o de lo contrario todos los permisos
    const buscarPermisosUsuario = await this.ruModel.find({
      relations: {
        permiso: true,
      },
      where: { user: { id: tokenUsuario.id_usuario } },
    });

    //Creamos e insertamos los permisos del usuario a los roles
    buscarPermisosUsuario.map(async (_, i) => {
      const rrCreado = this.rrModel.create({
        permiso: buscarPermisosUsuario[i].permiso,
        rol: rolRegistrado as RolEntity,
      });

      await this.rrModel.save(rrCreado);
    });

    return rolRegistrado;
  }

  //Put a single role
  async update(id: number, bodyRole: UpdateRolDTO, user: QueryToken) {
    const { modulos, nombre } = bodyRole;
    const { tokenUsuario } = user;

    const rol = await this.findRolesByName(id, nombre, user);

    //Valida si los modulos existen o no, si es no muestra error
    const listaModulos = await this.moduloService.validarModulosEntrantes(
      modulos,
    );

    const moduloProhibido = listaModulos.some(
      (a) => a.nombre === MOD_PRINCIPAL,
    );

    const nombreBody = nombre.toUpperCase().trim();

    /**
     * Validamos que el owner no puede cambiar de rol ni modificar su modulo principal y que un usuario normal no pueda ponerse el rol owner ni colocarse el modulo principal del owner
     */
    if (
      (tokenUsuario.rol.nombre === ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody === ROL_PRINCIPAL &&
        moduloProhibido) ||
      (tokenUsuario.rol.nombre === ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody !== ROL_PRINCIPAL &&
        moduloProhibido) ||
      (tokenUsuario.rol.nombre === ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody === ROL_PRINCIPAL &&
        !moduloProhibido) ||
      (tokenUsuario.rol.nombre !== ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody === ROL_PRINCIPAL &&
        moduloProhibido) ||
      (tokenUsuario.rol.nombre !== ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody !== ROL_PRINCIPAL &&
        moduloProhibido) ||
      (tokenUsuario.rol.nombre !== ROL_PRINCIPAL &&
        rol.nombre.toUpperCase() !== ROL_PRINCIPAL &&
        nombreBody === ROL_PRINCIPAL &&
        !moduloProhibido)
    ) {
      throw new HttpException(
        'Estas intentando una accion incorrecta, para nuestra seguridad capturamos tu ip',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const users = await this.findUsersWithOneRole_Local(id);

    if (users.length > 0) {
      const arrayOfStringIds = users.map((format) => format.id);
      const findCopysSU = await this.copySUModel.find({
        relations: {
          user: true,
          modulos: true,
        },
        where: { estado: true },
      });

      const modificados = [];

      users.filter((a) => {
        findCopysSU.filter((x) => {
          if (String(x.user.id) === String(a.id)) {
            modificados.push(a);
          }
        });
      });

      const noModificados = users.filter((fil) => !modificados.includes(fil));

      noModificados.map(async (noMod, i) => {
        //actualiza los mismo recursos enviados al rol hacia los usuarios que contienen el rol
        if (listaModulos[i]) {
          await this.suModel.update(
            {
              user: {
                id: noMod.id,
              },
            },
            {
              modulos: listaModulos[i],
            },
          );
        }
      });

      const findRUModifieds = await this.copySUModel.find({
        relations: {
          user: true,
          modulos: true,
        },
        where: {
          user: {
            id: In(arrayOfStringIds),
          },
        },
      });

      const dataSUMofied = findRUModifieds.map(async (ru, i) => {
        const enru = await this.suModel.find({
          relations: {
            user: true,
            modulos: true,
          },
          where: {
            user: {
              id: ru.user.id,
              estado: true,
            },
          },
        });

        const buscarModificadosARU = enru.filter(
          (a) => ru.modulos.id === a.modulos.id,
        );

        return {
          modulos: listaModulos
            .filter((res) => ru.modulos.id !== res.id)
            .concat(buscarModificadosARU.map((a) => a.modulos)),
          user: ru.user,
        };
      });

      dataSUMofied.map(async (data, i) => {
        await this.suModel.update(
          {
            user: {
              id: (await data).user.id,
            },
          },
          {
            modulos: (await data).modulos[i],
          },
        );
      });
    }

    const enviar_modificar = {
      ...bodyRole,
      nombre:
        tokenUsuario.rol.nombre === ROL_PRINCIPAL &&
        nombreBody === ROL_PRINCIPAL
          ? bodyRole.nombre.toUpperCase()
          : bodyRole.nombre,
      modulos: listaModulos,
      updatedAt: new Date(),
      user_update: user.tokenEntityFull,
    };

    const test = listaModulos.reduce((curr, prev) => {
      const item = rol.modulos.find((a) => a.id !== prev.id);

      if (item) {
        return [...curr, item];
      }

      return curr;
    }, []);
    console.log(test);
    await this.roleModel
      .createQueryBuilder()
      .relation(RolEntity, 'modulos')
      .of(rol)
      .remove(test);
    this.roleModel.merge(
      { ...rol, modulos: listaModulos } as any,
      enviar_modificar,
    );
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

  async findAll(user: QueryToken) {
    const { tokenUsuario } = user;
    let listRoles: RolEntity[] = [];

    // //Solo el owner puede ver todos lo roles
    if (tokenUsuario.rol.nombre === ROL_PRINCIPAL) {
      const rolesFindDb = await this.roleModel.find({
        relations: ['modulos'],
      });
      listRoles = rolesFindDb;
    } else {
      //Cualquier otro usuario puede ver sus roles creados por el mismo
      const rolesFindDb = await this.roleModel.find({
        relations: {
          modulos: true,
          user_create: true,
        },
        where: {
          user_create: {
            id: tokenUsuario.id_usuario,
          },
        },
      });

      listRoles = rolesFindDb.filter((role) => role.nombre !== ROL_PRINCIPAL);
    }

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

    // const queryRol: QueryRol = {
    //   id: existeRol.id,
    //   nombre: existeRol.nombre,
    //   detalle: existeRol.detalle,
    //   estado: existeRol.estado,
    //   fecha_creada: existeRol.createdAt,
    //   fecha_modificada: existeRol.updatedAt,
    //   modulos: existeRol.modulos.map((a) => {
    //     return {
    //       nombre: a.nombre,
    //       id: a.id,
    //     };
    //   }),
    // };

    // if (usoInterno) {
    //   queryRol['duenio'] = 'x';
    // }

    return existeRol as RolEntity;
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

  async findRolesByName(
    id: number,
    nombre: string,
    userToken?: QueryToken,
  ): Promise<RolEntity> {
    let rol: any = {};
    let roles: any[] = [];
    const { tokenBkUsuario } = userToken;

    try {
      rol = await this.roleModel.findOne({
        relations: {
          user_create: true,

          modulos: true,
        },
        where: {
          id,
          estado: true,
          user_create: {
            id: tokenBkUsuario.id_usuario,
          },
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar roles x nombre - Informar cod_error: RolService.findRolesByName.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!rol)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          type: 'BAD_REQUEST',
          message: 'El rol no existe o está inactivo.',
        },
        HttpStatus.BAD_REQUEST,
      );

    try {
      roles = await this.roleModel.find({
        where: {
          estado: true,
          user_create: {
            id: tokenBkUsuario.id_usuario,
          },
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar roles x nombre - Informar cod_error: RolService.findRolesByName.find',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const existeRepetidoXcreador = roles.find((a) => a.nombre === nombre);

    //Validamos si el usuario normal solo puede modificar sus roles creados por el y que no puede repetir el mismo nombre de uno creado por el mismo
    if (
      tokenBkUsuario.rol.nombre !== ROL_PRINCIPAL &&
      existeRepetidoXcreador &&
      existeRepetidoXcreador.nombre !== rol.nombre
    ) {
      throw new HttpException(
        'Ya existe un rol con ese nombre',
        HttpStatus.BAD_REQUEST,
      );
    }

    return rol;
  }

  async findModulesByOneRol(idRol: number): Promise<RolEntity> {
    return await this.roleModel.findOne({
      relations: { modulos: true },
      where: { id: idRol },
    });
  }

  async findUsersWithOneRole_Local(idRol: number): Promise<any> {
    let users = [];

    try {
      users = await this.userModel.find({
        relations: {
          rol: true,
        },
        where: {
          rol: {
            id: idRol,
          },
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar usuarios x rol - Informar cod_error: RolService.findUsersWithOneRole_Local.find',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return users;
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
