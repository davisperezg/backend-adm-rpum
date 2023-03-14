import { UpdateUserDTO } from './../dto/update-user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hashPassword } from 'src/lib/helpers/auth.helper';
import { RoleService } from 'src/role/services/role.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../enitty/user.entity';
import { Equal, Not, Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user';
import { QueryToken } from 'src/auth/dto/queryToken';
import { ROL_PRINCIPAL } from 'src/lib/const/consts';
import { PermisosUserEntity } from 'src/resources-users/entity/recursos-users.entity';
import { PermisosRolEntity } from 'src/resources-roles/entity/recursos-roles.entity';
import { ServicesUserEntity } from 'src/services-users/entity/servicios-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userModel: Repository<UserEntity>,
    @InjectRepository(PermisosUserEntity)
    private ruModel: Repository<PermisosUserEntity>,
    @InjectRepository(PermisosRolEntity)
    private rrModel: Repository<PermisosRolEntity>,
    @InjectRepository(ServicesUserEntity)
    private suModel: Repository<ServicesUserEntity>,
    private rolService: RoleService,
  ) {}

  async findAll(userToken: QueryToken) {
    const { tokenUsuario } = userToken;
    let users = [];
    if (tokenUsuario.rol.nombre === ROL_PRINCIPAL) {
      users = await this.userModel.find({
        select: {
          rol: {
            id: true,
            nombre: true,
          },
          user_create: {},
        },
        where: {
          rol: {
            nombre: Not(Equal(ROL_PRINCIPAL)),
          },
        },
        relations: {
          rol: true,
          user_create: true,
        },
      });
    } else {
      users = await this.userModel.find({
        select: {
          rol: {
            id: true,
            nombre: true,
          },
          user_create: {},
        },
        relations: {
          rol: true,
          user_create: true,
        },
        where: {
          user_create: {
            id: tokenUsuario.id_usuario,
          },
        },
      });
    }

    return users;
  }

  async changePassword(
    id: number,
    contrasenia: string,
    userToken: QueryToken,
  ): Promise<boolean> {
    const { tokenUsuario, tokenEntityFull } = userToken;

    const buscarProhibido = await this.userModel.findOne({
      relations: {
        rol: true,
        user_create: true,
      },
      where: {
        id,
      },
    });

    if (
      (buscarProhibido.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL) ||
      (buscarProhibido.user_create.email !== tokenEntityFull.email &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL)
    ) {
      throw new HttpException(
        'Estas intentando un accion incorrecta, tomaremos su ip para nuestra seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    let result = false;

    try {
      const passwordHashed = await hashPassword(contrasenia);
      this.userModel.merge(buscarProhibido, { contrasenia: passwordHashed });
      await this.userModel.save(buscarProhibido);

      result = true;
    } catch (e) {
      throw new Error(`Error en UserService.changePassword.save ${e}`);
    }
    return result;
  }

  async validarCorreoYDni(
    email: string,
    dni: string,
    idActualizar?: number,
    userToken?: QueryToken,
  ) {
    let userExiste: any = {};
    let userActualizar: any = {};

    //const { tokenUsuario } = userToken;

    try {
      userExiste = await this.userModel.findOne({
        relations: { user_create: true },
        where: [{ email: email ?? '' }, { dni: dni ?? '' }],
      });

      if (idActualizar) {
        userActualizar = await this.userModel.findOne({
          where: {
            id: idActualizar,
          },
        });
      }
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un usuario - Informar cod_error: UserService.validarCD.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // const buscarExistente = userExiste.find(
    //   (a) => a.user_create.id === tokenUsuario.id_usuario,
    // );
    //console.log(buscarExistente);
    if (userExiste) {
      const data = userExiste as UserEntity;
      const nombreEncontradoDB = data.email && data.email.trim().toLowerCase();
      const dniEncontradoDB = data.dni && data.dni.trim().toLowerCase();

      if (idActualizar) {
        if (
          email &&
          nombreEncontradoDB &&
          userExiste.id !== userActualizar.id
        ) {
          throw new HttpException(
            `El email ya le pertenece a otro usuario registrado`,
            HttpStatus.BAD_REQUEST,
          );
        }
        if (dni && dniEncontradoDB && userExiste.id !== userActualizar.id) {
          throw new HttpException(
            `El dni ya le pertenece a otro usuario registrado`,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        if (dniEncontradoDB === dni) {
          throw new HttpException(
            `El dni del usuario ya existe`,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (nombreEncontradoDB === email) {
          throw new HttpException(
            `El correo del usuario ya existe`,
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  //Add a single user
  async create(createUser: CreateUserDTO, userToken: QueryToken) {
    const { email, rol, contrasenia, dni } = createUser;
    const { tokenUsuario, tokenEntityFull } = userToken;

    //Validamos si ya existe un correo y un dni
    await this.validarCorreoYDni(email, dni);

    const contraseniaHashed = await hashPassword(contrasenia);

    const obtenerRol = await this.rolService.buscarRolXId(rol);

    //Ni el owner ni otro usuario puede registrar a otro owner
    if (
      (tokenUsuario.rol.nombre !== ROL_PRINCIPAL &&
        obtenerRol.nombre === ROL_PRINCIPAL) ||
      (tokenUsuario.rol.nombre === ROL_PRINCIPAL &&
        obtenerRol.nombre === ROL_PRINCIPAL)
    ) {
      throw new HttpException(
        'Tomaremos tu direccion ip para nuestra seguridad por intentar un accion prohibida',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    let usuarioRegistrado = {};

    try {
      //data a enviar para el registro de usuario
      const enviar_data = {
        ...createUser,
        contrasenia: contraseniaHashed,
        rol: obtenerRol,
        user_create: tokenEntityFull,
      };

      //crea usuario
      const nuevoUsuario = this.userModel.create(enviar_data);

      usuarioRegistrado = await this.userModel.save(nuevoUsuario);
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un usuario - Informar cod_error: UsuarioService.create.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //busco a los recursos del rol para asignarlo al usuario
    const permisosRol = await this.rrModel.find({
      relations: {
        rol: true,
        permiso: true,
      },
      where: {
        rol: {
          id: obtenerRol.id,
        },
      },
    });

    //crea recursos al usuario
    permisosRol.map(async (_, i) => {
      const suCreado = this.ruModel.create({
        permiso: permisosRol[i].permiso,
        user: usuarioRegistrado as UserEntity,
      });

      await this.ruModel.save(suCreado);
    });

    //busco los modulos del rol para asignarlo al usuario
    const modulesOfRol = await this.rolService.findModulesByOneRol(
      obtenerRol.id,
    );

    //crea modulos al usuario
    modulesOfRol.modulos.map(async (_, i) => {
      const suCreado = this.suModel.create({
        modulos: modulesOfRol.modulos[i],
        user: usuarioRegistrado as UserEntity,
      });

      await this.suModel.save(suCreado);
    });

    return usuarioRegistrado;
  }

  //Put a single user
  async update(id: number, bodyUser: UpdateUserDTO, userToken: QueryToken) {
    const { rol, email, dni } = bodyUser;
    const { tokenUsuario, tokenEntityFull } = userToken;

    const usuario = await this.findUserById(id);

    //Validamos si ya existe un correo y un dni
    if (email || dni) await this.validarCorreoYDni(email, dni, id);

    const buscarRol = rol
      ? await this.rolService.buscarRolXId(rol)
      : usuario.rol;

    //el usuario no puede actualizar otro rol a owner o si encuentra que el usuario del owner esta siendo modificado tampoco puede actualizar
    if (
      (usuario.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL) ||
      (buscarRol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL) ||
      (buscarRol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre === ROL_PRINCIPAL)
    ) {
      throw new HttpException(
        'Esta intentado un accion incorrecta, capturaremos tu ip para nuestra seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    this.userModel.merge(usuario, {
      ...bodyUser,
      rol: buscarRol,
      user_update: tokenEntityFull,
    });
    return await this.userModel.save(usuario);
  }

  //Delete a single user
  async delete(id: number, user: QueryToken): Promise<boolean> {
    let result = false;
    const { tokenUsuario, tokenEntityFull } = user;
    // const rolToken = findUser.role;

    const dataUsuario = await this.buscarUsuarioXIdXEstado(id, true);
    if (!dataUsuario)
      throw new HttpException(
        'El usuario ya ha sido deshabilitado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    //Ni el owner ni cualquier otro usuario puede eliminar al owner
    if (
      (dataUsuario.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL) ||
      (dataUsuario.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre === ROL_PRINCIPAL) ||
      (dataUsuario.user_create.email !== tokenEntityFull.email &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL)
    ) {
      throw new HttpException(
        'Accion incorrecta tomaremos tu ip para mayor seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    try {
      this.userModel.merge(dataUsuario, {
        estado: false,
        user_delete: tokenEntityFull,
      });

      await this.userModel.save(dataUsuario);

      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar deshablitar un usuario - Informar cod_error: UsuarioService.delete.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  //Restore a single user
  async restore(id: number, userToken: QueryToken): Promise<boolean> {
    const { tokenUsuario, tokenEntityFull } = userToken;
    // const rolToken = findUser.role;
    let result = false;

    const dataUsuario = await this.buscarUsuarioXIdXEstado(id, false);
    if (!dataUsuario)
      throw new HttpException(
        'El usuario ya ha sido habiliado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    //Ni el owner ni cualquier otro usuario permite retaurar al owner
    if (
      (dataUsuario.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL) ||
      (dataUsuario.rol.nombre === ROL_PRINCIPAL &&
        tokenUsuario.rol.nombre === ROL_PRINCIPAL) ||
      (dataUsuario.user_create.email !== tokenEntityFull.email &&
        tokenUsuario.rol.nombre !== ROL_PRINCIPAL)
    ) {
      throw new HttpException(
        'Estas intentado una accion incorrecta tomaremos tu ip para nuestra seguridad',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    try {
      this.userModel.merge(dataUsuario, {
        estado: true,
        user_restore: tokenEntityFull,
      });
      await this.userModel.save(dataUsuario);
      result = true;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar habilitar un usuario - Informar cod_error: UsuarioService.restore.save',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  //find user by email
  async findUserByUsername(email: string): Promise<any> {
    // return await this.userModel.findOne({ email });
    return;
  }

  //find user by id to jwt.strategies
  async findUserById(id: number): Promise<UserEntity> {
    let result = {};

    try {
      result = await this.userModel.findOne({
        relations: ['rol', 'user_create'],
        where: {
          id,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar obtener un usuario - Informar cod_error: UsuarioService.findUserById.find',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!result) {
      throw new HttpException(
        'No se encontro un usuario válido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return result as UserEntity;
  }

  //find user by nroDocument
  async findUserByCodApi(nro: number) {
    // const user = await this.userModel.findById(nro).populate([
    //   {
    //     path: 'role',
    //     populate: [
    //       {
    //         path: 'module',
    //         populate: [{ path: 'menu' }],
    //       },
    //     ],
    //   },
    //   {
    //     path: 'resource',
    //   },
    //   {
    //     path: 'creator',
    //     populate: {
    //       path: 'role',
    //       populate: {
    //         path: 'module',
    //       },
    //     },
    //   },
    // ]);

    // const formatUsers = {
    //   _id: user._id,
    //   name: user.name,
    //   lastname: user.lastname,
    //   fullname: user.name + ' ' + user.lastname,
    //   tipDocument: user.tipDocument,
    //   nroDocument: user.nroDocument,
    //   status: user.status,
    //   email: user.email,
    //   owner: user.creator
    //     ? user.creator.name + ' ' + user.creator.lastname
    //     : 'Ninguno',
    //   role: user.role.name,
    //   roleId: (<any>user.role)._id,
    // };

    // return formatUsers;
    return {};
  }

  async findUserByIdRol(id: string): Promise<any> {
    //   const user = await this.userModel.findOne({
    //     role: id as any,
    //   });

    //   return user;
    // }
    return {};
  }

  async buscarUsuarioXIdXEstado(id: number, estado: boolean) {
    try {
      return await this.userModel.findOne({
        relations: ['rol'],
        where: {
          id,
          estado,
        },
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar buscar un rol - Informar cod_error: UsuarioService.buscarUsuarioXId.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
