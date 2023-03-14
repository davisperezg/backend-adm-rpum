import Permission from 'src/lib/type/permission.type';
import { UserEntity } from 'src/user/enitty/user.entity';
class QueryTokenUser {
  id_usuario: number;
  usuario: string;
  estado_usuario: boolean;
  rol: {
    nombre: string;
    modulos: {
      nombre: string;
      estado: boolean;
      menus: {
        nombre: string;
        estado: boolean;
      }[];
    }[];
  };
  estado_rol: boolean;
}

class QueryTokenBkUser extends QueryTokenUser {
  creado_por: QueryTokenUser;
}

export class QueryToken {
  tokenUsuario: QueryTokenUser;
  tokenBkUsuario: QueryTokenBkUser;
  tokenPermisos: Permission[];
  tokenEntityFull: UserEntity;
}
