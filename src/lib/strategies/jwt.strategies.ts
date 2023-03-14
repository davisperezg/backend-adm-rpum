import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { ResourcesUsersService } from 'src/resources-users/services/resources-users.service';
import { ROL_PRINCIPAL } from '../const/consts';

interface JWType {
  userId: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly ruService: ResourcesUsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JWType) {
    const { json, entity } = await this.authService.validateUser(
      payload.userId,
    );

    const myUser: any = json;

    //busca los modulos y menus activos
    const modulesTrues = myUser.rol.modulos
      .filter((mod) => mod.estado === true)
      .map((mod) => {
        return {
          ...mod,
          menus: mod.menus.filter((filt) => filt.estado === true),
        };
      });

    const validaModules = [];
    if (myUser.rol.nombre !== ROL_PRINCIPAL) {
      myUser.creado_por.rol.modulos.filter((mod) => {
        modulesTrues.filter((mods) => {
          if (mod.nombre === mods.nombre) {
            validaModules.push(mods);
          }
        });
      });
    }

    const tokenUsuario = [myUser].map((format) => {
      return {
        ...format,
        rol: {
          ...format.rol,
          modulos:
            myUser.rol.nombre === ROL_PRINCIPAL ? modulesTrues : validaModules,
        },
      };
    })[0];

    //si el usuario tiene estado false se cierra el acceso al sistema
    if (tokenUsuario.estado_usuario === false) {
      throw new HttpException('Acceso denegado!!', HttpStatus.UNAUTHORIZED);
    }

    const tokenPermisos = await this.ruService.findOneResourceByUser(
      payload.userId,
    );

    const dataToken = {
      tokenBkUsuario: { ...tokenUsuario },
      tokenUsuario,
      tokenPermisos,
      tokenEntityFull: entity,
    };

    //Eliminamos la propiedad creado_por en tokenUsuario
    delete dataToken.tokenUsuario.creado_por;

    if (!dataToken) {
      throw new UnauthorizedException('Acceso denegado!!!');
    }

    return dataToken;
  }
}
