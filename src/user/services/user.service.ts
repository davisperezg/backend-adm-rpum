import {
  Services_User,
  Services_UserDocument,
} from './../../services-users/schemas/services-user';
import {
  Resource_Role,
  Resource_RoleDocument,
} from './../../resources-roles/schemas/resources-role';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/lib/helpers/auth.helper';
import { RoleService } from 'src/role/services/role.service';
import { User, UserDocument } from '../schemas/user.schema';
import {
  Resource_UserDocument,
  Resource_User,
} from 'src/resources-users/schemas/resources-user';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../enitty/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userModel: Repository<UserEntity>, // private readonly roleService: RoleService, // @InjectModel(Resource_User.name) // private ruModel: Model<Resource_UserDocument>, // @InjectModel(Services_User.name) // private suModel: Model<Services_UserDocument>, // @InjectModel(Resource_Role.name) // private rrModel: Model<Resource_RoleDocument>,
    private rolService: RoleService,
  ) {}

  // async onApplicationBootstrap() {
  //   //si haz creado una proiedad en el schema y vas actulizarla en la bd con un valor en especifico usamos el siguiente código:

  //   // await this.userModel.updateMany(
  //   //   {
  //   //     updateResource: null,
  //   //   },
  //   //   { updateResource: false },
  //   // );

  //   const count = await this.userModel.estimatedDocumentCount();

  //   if (count > 0) return;

  //   try {
  //     const passwordHashed = await hashPassword('admin123');

  //     const getRole = await this.roleService.findRoleByName(String('OWNER'));

  //     setTimeout(async () => {
  //       const count = await this.userModel.estimatedDocumentCount();

  //       if (count > 0) return;

  //       await this.userModel.insertMany([
  //         {
  //           name: 'El',
  //           lastname: 'Duenio',
  //           tipDocument: 'DNI',
  //           nroDocument: '99999999',
  //           email: 'admin@admin.com',
  //           password: passwordHashed,
  //           status: true,
  //           role: getRole._id,
  //           creator: null,
  //         },
  //       ]);
  //     }, 6000);
  //   } catch (e) {
  //     throw new Error(`Error en UserService.onApplicationBootstrap ${e}`);
  //   }
  // }

  async findAll(userToken?: any): Promise<any[]> {
    // const { findUser } = userToken;
    let users = [];
    // if (findUser.role === 'OWNER') {
    //   const listusers = await this.userModel.find().populate([
    //     {
    //       path: 'role',
    //     },
    //     {
    //       path: 'creator',
    //     },
    //   ]);
    //   users = listusers.filter((user) => user.role.name !== 'OWNER');
    // } else {
    //   users = await this.userModel.find({ creator: findUser._id }).populate([
    //     {
    //       path: 'role',
    //     },
    //     {
    //       path: 'creator',
    //     },
    //   ]);
    // }

    // const formatUsers = users.map((user) => {
    //   return {
    //     _id: user._id,
    //     name: user.name,
    //     lastname: user.lastname,
    //     fullname: user.name + ' ' + user.lastname,
    //     tipDocument: user.tipDocument,
    //     nroDocument: user.nroDocument,
    //     status: user.status,
    //     email: user.email,
    //     owner: user.creator
    //       ? user.creator.name + ' ' + user.creator.lastname
    //       : 'Ninguno',
    //     role: user.role.name,
    //   };
    // });
    //return formatUsers;
    return [];
  }

  async changePassword(
    id: string,
    data: { password: string },
    userToken?: any,
  ): Promise<boolean> {
    // const findForbidden = await this.userModel.findById(id).populate([
    //   {
    //     path: 'role',
    //   },
    //   {
    //     path: 'creator',
    //   },
    // ]);
    // const { findUser } = userToken;
    // const rolToken = findUser.role;

    // if (
    //   (findForbidden.role.name === 'OWNER' && rolToken !== 'OWNER') ||
    //   (findForbidden.creator.email !== findUser.email && rolToken !== 'OWNER')
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Unauthorized Exception',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // let result = false;
    // const { password } = data;
    // try {
    //   const passwordHashed = await hashPassword(password);
    //   await this.userModel.findByIdAndUpdate(
    //     id,
    //     { password: passwordHashed },
    //     {
    //       new: true,
    //     },
    //   );
    //   result = true;
    // } catch (e) {
    //   throw new Error(`Error en UserService.changePassword ${e}`);
    // }
    // return result;
    return false;
  }

  async validarCorreoYDni(email: string, dni: string) {
    let userExiste = {};

    try {
      userExiste = await this.userModel.findOne({
        where: [{ email: email }, { dni: dni }],
      });
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar crear un usuario - Informar cod_error: UserService.validarCD.findOne',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (userExiste) {
      const data = userExiste as UserEntity;

      const nombreEncontradoDB = data.email && data.email.trim().toLowerCase();
      const dniEncontradoDB = data.dni && data.dni.trim().toLowerCase();

      if (dniEncontradoDB === dni.trim().toLowerCase()) {
        throw new HttpException(
          `El dni del usuario ya existe`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (nombreEncontradoDB === email.trim().toLowerCase()) {
        throw new HttpException(
          `El correo del usuario ya existe`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  //Add a single user
  async create(createUser: CreateUserDTO, userToken?: any) {
    const { email, rol, contrasenia, dni } = createUser;
    // const { findUser } = userToken;

    //Validamos si ya existe un correo y un dni
    await this.validarCorreoYDni(email, dni);

    const contraseniaHashed = await hashPassword(contrasenia);

    const obtenerRol = await this.rolService.buscarRolXId(rol);

    // //Ni el owner ni otro usuario puede registrar a otro owner
    // if (
    //   (findUser.role !== 'OWNER' && getRole.name === 'OWNER') ||
    //   (findUser.role === 'OWNER' && getRole.name === 'OWNER')
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Unauthorized Exception',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    let usuarioRegistrado = {};

    try {
      //data a enviar para el registro de usuario
      const enviar_data = {
        ...createUser,
        contrasenia: contraseniaHashed,
        rol: obtenerRol,
        //creator: findUser._id,
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
    // //busco a los recursos del rol para asignarlo al usuario
    // const resourcesOfRol = await this.rrModel.findOne({ role: getRole._id });

    // //busco los modulos del rol para asignarlo al usuario
    // const modulesOfRol = await this.roleService.findModulesByOneRol(
    //   String(resourcesOfRol.role),
    // );

    // //data a enviar para el recurso del usuario
    // const sendDataResource: Resource_User = {
    //   status: true,
    //   resource: resourcesOfRol?.resource || [],
    //   user: createdUser._id,
    // };

    // const sendDataSu: Services_User = {
    //   status: true,
    //   user: createdUser._id,
    //   module: modulesOfRol.module,
    // };

    // //crea recursos al usuario
    // await new this.ruModel(sendDataResource).save();

    // //crea modulos al usuario
    // await new this.suModel(sendDataSu).save();

    // return createdUser.save();
    return usuarioRegistrado;
  }

  //Put a single user
  async update(id: string, bodyUser: User, userToken?: any): Promise<User> {
    // const { status, role, password, nroDocument, email } = bodyUser;
    // const { findUser } = userToken;
    // const rolToken = findUser.role;
    // const findForbidden = await this.userModel.findById(id).populate([
    //   {
    //     path: 'role',
    //   },
    //   {
    //     path: 'creator',
    //   },
    // ]);

    // //validar que el nro de documento o email actualizados no pertenezcan a otro usuario
    // const findNroDocument = await this.userModel.findOne({ nroDocument });
    // const findEmail = await this.userModel.findOne({ email });
    // const getRoleOfBody = await this.roleService.findRoleById(String(role));
    // if (
    //   findNroDocument &&
    //   String(findNroDocument._id).toLowerCase() !==
    //     String(findForbidden._id).toLowerCase()
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.BAD_REQUEST,
    //       type: 'BAD_REQUEST',
    //       message:
    //         'El nro de documento ya le pertenece a otro usuario registrado.',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // if (
    //   findEmail &&
    //   String(findEmail._id).toLowerCase() !==
    //     String(findForbidden._id).toLowerCase()
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.BAD_REQUEST,
    //       type: 'BAD_REQUEST',
    //       message:
    //         'El username o email ya le pertenece a otro usuario registrado.',
    //     },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    // //el usuario no puede actualizar otro rol a owner o si encuentra que el usuario del owner esta siendo modificado tampoco puede actualizar
    // if (
    //   (findForbidden.role.name === 'OWNER' && rolToken !== 'OWNER') ||
    //   (findForbidden.creator.email !== findUser.email &&
    //     rolToken !== 'OWNER') ||
    //   (getRoleOfBody.name === 'OWNER' && rolToken !== 'OWNER') ||
    //   (getRoleOfBody.name === 'OWNER' && rolToken === 'OWNER')
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Unauthorized Exception',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    // const modifyData: User = {
    //   ...bodyUser,
    //   role: role,
    // };

    // return await this.userModel.findByIdAndUpdate(id, modifyData, {
    //   new: true,
    // });
    return;
  }

  //Delete a single user
  async delete(id: number, user?: any): Promise<boolean> {
    let result = false;
    // const { findUser } = user;
    // const rolToken = findUser.role;

    const dataUsuario = await this.buscarUsuarioXIdXEstado(id, true);
    if (!dataUsuario)
      throw new HttpException(
        'El usuario ya ha sido deshabilitado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    // //Ni el owner ni cualquier otro usuario puede eliminar al owner
    // if (
    //   (findForbidden.role.name === 'OWNER' && rolToken !== 'OWNER') ||
    //   (findForbidden.role.name === 'OWNER' && rolToken === 'OWNER') ||
    //   (findForbidden.creator.email !== findUser.email && rolToken !== 'OWNER')
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Unauthorized Exception',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    try {
      this.userModel.merge(dataUsuario, { estado: false });

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
  async restore(id: number, userToken?: any): Promise<boolean> {
    // const { findUser } = userToken;
    // const rolToken = findUser.role;
    let result = false;

    const dataUsuario = await this.buscarUsuarioXIdXEstado(id, false);
    if (!dataUsuario)
      throw new HttpException(
        'El usuario ya ha sido habiliado',
        HttpStatus.NOT_ACCEPTABLE,
      );

    // //Ni el owner ni cualquier otro usuario permite retaurar al owner
    // if (
    //   (findForbidden.role.name === 'OWNER' && rolToken !== 'OWNER') ||
    //   (findForbidden.role.name === 'OWNER' && rolToken === 'OWNER') ||
    //   (findForbidden.creator.email !== findUser.email && rolToken !== 'OWNER')
    // ) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Unauthorized Exception',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }

    try {
      this.userModel.merge(dataUsuario, { estado: true });
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

  //find user by id
  async findUserById(id: string): Promise<any> {
    // return await this.userModel.findById(id).populate([
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
    //     path: 'creator',
    //     populate: {
    //       path: 'role',
    //       populate: {
    //         path: 'module',
    //       },
    //     },
    //   },
    // ]);
    return {};
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
