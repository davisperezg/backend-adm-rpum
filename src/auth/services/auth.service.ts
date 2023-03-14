import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { uid } from 'rand-token';
import { comparePassword } from 'src/lib/helpers/auth.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/enitty/user.entity';
import { DataSource, Repository } from 'typeorm';

const refreshTokens = {};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userModel: Repository<UserEntity>,
    private readonly jwt: JwtService,
    private dataSource: DataSource,
  ) {}

  //login user
  async signIn(email: string, password: string) {
    const refresh_token = uid(256);

    //find user by username
    const buscarUsuario = await this.userModel.findOne({
      select: {
        id: true,
        estado: true,
        email: true,
        nombres: true,
        apellidos: true,
        contrasenia: true,
      },
      where: {
        email,
      },
    });

    //Si no existe usuario invalido
    if (!buscarUsuario)
      throw new HttpException(
        'Usuario y/o contraseña incorrecto',
        HttpStatus.BAD_REQUEST,
      );

    //verify password with password hashed in db
    const isMatch = await comparePassword(password, buscarUsuario.contrasenia);

    //if does not exist
    if (!isMatch)
      throw new HttpException(
        'Usuario y/o contraseña incorrecto',
        HttpStatus.BAD_REQUEST,
      );

    if (buscarUsuario.estado !== true)
      throw new HttpException(
        'Usuario sin acceso al sistema',
        HttpStatus.UNAUTHORIZED,
      );

    //email in refresh token
    refreshTokens[refresh_token] = email;
    // //return {access_token and refresh_token}
    return { access_token: this.getToken(buscarUsuario.id), refresh_token };
  }

  //method to validate token with refresh-token v0.0.1
  async getTokenWithRefresh(body: { email: string; refreshToken: string }) {
    // const email = body.email;
    // const refreshToken = body.refreshToken;
    // const findUser = await this.userService.findUserByUsername(email);
    // //verify if exist refresh token and email in refresh token, is correct  ?f
    // if (
    //   refreshToken in refreshTokens &&
    //   refreshTokens[refreshToken] === email
    // ) {
    //   return { access_token: this.getToken(findUser._id) };
    // } else {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       type: 'UNAUTHORIZED',
    //       message: 'Ocurrio un error, recargue la pagina.',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //   );
    // }
  }

  //method to get token in login
  getToken(id: number): string {
    const payload = { userId: id };
    return this.jwt.sign(payload);
  }

  //validate user searching by id to jwt.strategies.ts
  async validateUser(id: number) {
    let formatoJson = {
      json: {},
      entity: {},
    };

    try {
      const rawData = await this.userModel.findOne({
        relations: {
          user_create: {
            rol: {
              modulos: {
                menus: true,
              },
            },
          },
          rol: {
            modulos: {
              menus: true,
            },
          },
        },
        where: {
          id,
        },
      });

      formatoJson = {
        json: {
          id_usuario: rawData.id,
          usuario: rawData.nombres + ' ' + rawData.apellidos,
          estado_usuario: rawData.estado,
          rol: {
            nombre: rawData.rol.nombre,
            modulos: rawData.rol.modulos.map((a) => ({
              nombre: a.nombre,
              estado: a.estado,
              menus: a.menus.map((b) => ({
                nombre: b.nombre,
                estado: b.estado,
              })),
            })),
          },
          estado_rol: rawData.rol.estado,
          creado_por: rawData.user_create
            ? {
                id_usuario: rawData.user_create.id,
                usuario:
                  rawData.user_create.nombres +
                  ' ' +
                  rawData.user_create.apellidos,
                estado_usuario: rawData.user_create.estado,
                rol: {
                  nombre: rawData.user_create.rol.nombre,
                  modulos: rawData.user_create.rol.modulos.map((a) => ({
                    nombre: a.nombre,
                    estado: a.estado,
                    menus: a.menus.map((b) => ({
                      nombre: b.nombre,
                      estado: b.estado,
                    })),
                  })),
                },
              }
            : null,
        },
        entity: rawData,
      };
    } catch (e) {
      throw new HttpException(
        'El token del usuario no existe. Vuelva a logear!!',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!formatoJson)
      throw new HttpException(
        'El token del usuario no existe. Vuelva a logear!!',
        HttpStatus.NOT_ACCEPTABLE,
      );

    return formatoJson;
  }
}
