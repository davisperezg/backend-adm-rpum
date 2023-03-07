export const MOD_PRINCIPAL = 'Administración de sistema - PRINCIPAL';
export const ROL_PRINCIPAL = 'OWNER';
export const CATEGORIA_1 = 'Usuarios';
export const CATEGORIA_2 = 'Modulos';
export const CATEGORIA_3 = 'Roles';
export const CATEGORIA_4 = 'Desarrollador';
export const resourcesByDefault = [];
export const RECURSOS_DEFECTOS = [
  // USERS
  {
    nombre: 'Leer Usuarios', //add
    key: 'canRead_users',
    detalle: 'Te permite leer usuarios en su tabla.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Obtener informacion por usuario', //add
    key: 'canGetUser',
    detalle: 'Te permite obtener data de un usuario.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Crear Usuarios', //add
    key: 'canCreate_users',
    detalle: 'Te permite crear un usuario.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Editar Usuarios', //add
    key: 'canEdit_users',
    detalle: 'Te permite editar un usuario.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Eliminar Usuarios', //add
    key: 'canDelete_users',
    detalle: 'Te permite desactivar un usuario esto afectara al loguearse.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Cambiar contraseña de usuarios', //add
    key: 'canChangePassword_users',
    detalle: 'Te permite cambiar la password del usuario.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Restaurar Usuarios', //add
    key: 'canRestore_users',
    detalle: 'Te permite restaurar un usuario desactivado.',
    categoria: CATEGORIA_1,
  },
  // MODULES
  {
    nombre: 'Leer Modulos', //add
    key: 'canRead_modulesList',
    detalle: 'Te permite leer todos los modulos en su tabla.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Leer Modulos en otras entidades', //add
    key: 'canRead_modulesItem',
    detalle: 'Te permite leer los modulos en la entidad usuario o roles.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Obtener informacion por modulo', //add
    key: 'canGetModule',
    detalle:
      'Te permite obtener la data de los modulos asignados al usuario al logearte y al editar un modulo.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Crear Modulos', //add
    key: 'canCreate_modules',
    detalle: 'Te permite crear un modulo.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Editar Modulos', //add
    key: 'canEdit_modules',
    detalle: 'Te permite editar un modulo.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Eliminar Modulos', //add
    key: 'canDelete_modules',
    detalle:
      'Te permite desactivar un modulo esto afecta a todos los usuarios que tienen el modulo asignado.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Restaurar Modulos', //add
    key: 'canRestore_modules',
    detalle: 'Te permite restaurar el modulo desactivado.',
    categoria: CATEGORIA_2,
  },
  // ROLES
  {
    nombre: 'Crear Roles', //add
    key: 'canCreate_roles',
    detalle: 'Te permite crear un rol.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Editar Roles', //add
    key: 'canEdit_roles',
    detalle: 'Te permite editar un rol.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Eliminar Roles', //add
    key: 'canDelete_roles',
    detalle:
      'Te permite desactivar un rol esto afectara al registrar un nuevo usuario o al editar un usuario con el mismo rol desactivado.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Leer Roles', //add
    key: 'canRead_roles',
    detalle: 'Te permite leer todos los roles en su tabla.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Obtener informacion por rol', //add
    key: 'canGetRole',
    detalle: 'Te permite obtener la data de un rol.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Restaurar Roles', //add
    key: 'canRestore_roles',
    detalle: 'Te permite resturar un rol desactivado.',
    categoria: CATEGORIA_3,
  },
  // RESOURCES
  {
    nombre: 'Crear Permiso(DESARROLLADOR)', //add
    key: 'canCreate_Resource',
    detalle:
      'Te permite crear un permiso(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Leer Permisos(DESARROLLADOR)', //add
    key: 'canRead_ResourcesList',
    detalle:
      'Te permite leer todos los permisos de su tabla(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Leer Permisos en otras entidades', //add
    key: 'canRead_ResourcesItem',
    detalle: 'Te permite leer los permisos en las entidades usuario o rol',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Editar Permisos(DESARROLLADOR)', //add
    key: 'canEdit_Resource',
    detalle:
      'Te permite editar un permiso(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Obtener informacion por permiso(DESARROLLADOR)', //add
    key: 'canGetResource',
    detalle:
      'Te permite obtener la data por permiso(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  // RR
  {
    nombre: 'Leer los recursos por rol en la entidad rol', //add
    key: 'canRead_ResourcebyRol',
    detalle: 'Te permite leer los recursos o permisos en la entidad solo rol.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Crear y/o actualizar recursos por roles', //add
    key: 'canCreate_ResourceR',
    detalle:
      'Te permite crear y/o actualizar los recrusos o permisos en la entidad solo rol.',
    categoria: CATEGORIA_4,
  },
  // MENU
  {
    nombre: 'Leer Menus', //add
    key: 'canRead_menus',
    detalle: 'Te permite leer menus en la entidad modulos.',
  },
  {
    nombre: 'Crear Menu(DESARROLLADOR)', //add
    key: 'canCreate_menus',
    detalle:
      'Te permite crear un menu(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Editar Menu(DESARROLLADOR)', //add
    key: 'canEdit_menus',
    detalle:
      'Te permite crear un menu(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Eliminar Menu(DESARROLLADOR)', //add
    key: 'canDelete_menus',
    detalle:
      'Te permite crear un menu(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Restaurar Menu(DESARROLLADOR)', //add
    key: 'canRestore_menus',
    detalle:
      'Te permite crear un menu(Se recomienda solo para desarrolladores).',
    categoria: CATEGORIA_4,
  },
  // RU
  {
    nombre: 'Leer los recursos por usuario en otras entidades', //add
    key: 'canRead_ResourcebyUser',
    detalle:
      'Te permite leer los recursos o permisos por usuario solo en la entidad usuario.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Crear y/o actualizar recursos por usuario', //add
    key: 'canCreate_ResourceU',
    detalle:
      'Te permite crear y/o actualizar los permisos o recusos por usuario solo en la entidad usuario.',
    categoria: CATEGORIA_4,
  },
  // SU
  {
    nombre: 'Leer los modulos o servicios por usuario en otras entidades', //add
    key: 'canRead_ServicebyUser',
    detalle:
      'Te permite leer los modulos o servicios por usuario esto afecta al usuario al loguearse y en la entidad usuario',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Crear y/o actualizar modulos o servicios por usuario', //add
    key: 'canCreate_ServiceU',
    detalle:
      'Te permite crear y/o actualizar los modulos o servicios por usuario solo en la entidad usuario.',
    categoria: CATEGORIA_4,
  },
];
