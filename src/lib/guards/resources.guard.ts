import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import Permission from '../type/permission.type';
import { JwtAuthGuard } from './auth.guard';

const PermissionGuard = (
  permission: Permission | Permission[],
): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<any>();
      const permisosToken = request.user.tokenPermisos;

      //Si el permiso es un solo valor
      if (typeof permission == 'string') {
        if (!permisosToken.includes(permission))
          throw new ForbiddenException(
            'No tienes permiso para acceder a este recurso',
          );

        //Si el permiso existe con los permisos del token generamos la solicitud
        return permisosToken.includes(permission);
      } else {
        //Si recibe un array de permisos que verifique si por lo menos existe 1
        const existeMinPermiso = permission.find((a) =>
          permisosToken.includes(a),
        );

        //Si no existe ninguno manda error
        if (!existeMinPermiso)
          throw new ForbiddenException(
            'No tienes permiso para acceder a este recurso',
          );

        //Si existe 1 genera la solicitud
        return permisosToken.includes(existeMinPermiso);
      }
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
