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
    nombre: 'Crear Usuarios', //add
    key: 'canCreate_users',
    detalle: 'Te permite crear usuarios.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Leer Usuarios', //add
    key: 'canRead_users',
    detalle: 'Te permite leer usuarios.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Editar Usuarios', //add
    key: 'canUpdate_users',
    detalle: 'Te permite editar un usuario.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Desactivar Usuarios', //add
    key: 'canDelete_users',
    detalle: 'Te permite desactivar un usuario esto afectara al loguearse.',
    categoria: CATEGORIA_1,
  },
  {
    nombre: 'Vizualizar data de usuarios', //add
    key: 'canGet_users',
    detalle: 'Te permite ver el detalle o data de un usuario en especifico.',
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
    detalle: 'Te permite restaurar un usuario.',
    categoria: CATEGORIA_1,
  }, //FIN DE USUARIOS
  // MODULES
  {
    nombre: 'Crear Modulos', //add
    key: 'canCreate_modules',
    detalle: 'Te permite crear modulos.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Leer Modulos', //add
    key: 'canRead_modules',
    detalle: 'Te permite leer los modulos.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Editar Modulos', //add
    key: 'canUpdate_modules',
    detalle: 'Te permite editar modulos.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Desactivar Modulos', //add
    key: 'canDelete_modules',
    detalle: 'Te permite desactivar modulos.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Vizualizar data de modulos', //add
    key: 'canGet_modules',
    detalle: 'Te permite ver el detalle o data de un modulo en especifico.',
    categoria: CATEGORIA_2,
  },
  {
    nombre: 'Restaurar Modulos', //add
    key: 'canRestore_modules',
    detalle: 'Te permite restaurar modulos.',
    categoria: CATEGORIA_2,
  }, //FIN DE MODULOS
  // {
  //   nombre: 'Leer Modulos en otras entidades', //add
  //   key: 'canRead_modulesItem',
  //   detalle: 'Te permite leer los modulos en la entidad usuario o roles.',
  //   categoria: CATEGORIA_2,
  // },

  // ROLES
  {
    nombre: 'Crear Roles', //add
    key: 'canCreate_roles',
    detalle: 'Te permite crear roles.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Leer Roles', //add
    key: 'canRead_roles',
    detalle: 'Te permite leer roles.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Editar Roles', //add
    key: 'canUpdate_roles',
    detalle: 'Te permite editar roles.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Desactivar Roles', //add
    key: 'canDelete_roles',
    detalle: 'Te permite desactivar un roles.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Vizualizar data de roles', //add
    key: 'canGet_roles',
    detalle: 'Te permite ver el detalle o data de un rol en especifico.',
    categoria: CATEGORIA_3,
  },
  {
    nombre: 'Restaurar Roles', //add
    key: 'canRestore_roles',
    detalle: 'Te permite resturar roles.',
    categoria: CATEGORIA_3,
  },
  // PERMISOS
  {
    nombre: 'Crear Permisos', //add
    key: 'canCreate_permisos',
    detalle: 'Te permite crear permisos.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Leer Permisos', //add
    key: 'canRead_permisos',
    detalle: 'Te permite leer permisos.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Editar Permisos', //add
    key: 'canUpdate_permisos',
    detalle: 'Te permite editar permisos.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Vizualizar data de permisos', //add
    key: 'canGet_permisos',
    detalle: 'Te permite ver el detalle o data de un permiso en especifico.',
    categoria: CATEGORIA_4,
  }, //FIN PERMISOS
  // {
  //   nombre: 'Leer Permisos en otras entidades', //add
  //   key: 'canRead_ResourcesItem',
  //   detalle: 'Te permite leer los permisos en las entidades usuario o rol',
  //   categoria: CATEGORIA_4,
  // },
  // RR
  // {
  //   nombre: 'Leer los recursos por rol en la entidad rol', //add
  //   key: 'canRead_ResourcebyRol',
  //   detalle: 'Te permite leer los recursos o permisos en la entidad solo rol.',
  //   categoria: CATEGORIA_4,
  // },
  // {
  //   nombre: 'Crear y/o actualizar recursos por roles', //add
  //   key: 'canCreate_ResourceR',
  //   detalle:
  //     'Te permite crear y/o actualizar los recrusos o permisos en la entidad solo rol.',
  //   categoria: CATEGORIA_4,
  // },
  // MENU
  {
    nombre: 'Crear Menu', //add
    key: 'canCreate_menus',
    detalle: 'Te permite crear menus.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Leer Menus', //add
    key: 'canRead_menus',
    detalle: 'Te permite leer menus.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Editar Menus', //add
    key: 'canUpdate_menus',
    detalle: 'Te permite editar menus.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Desactivar Menus', //add
    key: 'canDelete_menus',
    detalle: 'Te permite desactivar menus.',
    categoria: CATEGORIA_4,
  },
  {
    nombre: 'Restaurar Menu', //add
    key: 'canRestore_menus',
    detalle: 'Te permite restaurar menus.',
    categoria: CATEGORIA_4,
  },
  // RU
  // {
  //   nombre: 'Leer los recursos por usuario en otras entidades', //add
  //   key: 'canRead_ResourcebyUser',
  //   detalle:
  //     'Te permite leer los recursos o permisos por usuario solo en la entidad usuario.',
  //   categoria: CATEGORIA_4,
  // },
  // {
  //   nombre: 'Crear y/o actualizar recursos por usuario', //add
  //   key: 'canCreate_ResourceU',
  //   detalle:
  //     'Te permite crear y/o actualizar los permisos o recusos por usuario solo en la entidad usuario.',
  //   categoria: CATEGORIA_4,
  // },
  // SU
  // {
  //   nombre: 'Leer los modulos o servicios por usuario en otras entidades', //add
  //   key: 'canRead_ServicebyUser',
  //   detalle:
  //     'Te permite leer los modulos o servicios por usuario esto afecta al usuario al loguearse y en la entidad usuario',
  //   categoria: CATEGORIA_4,
  // },
  // {
  //   nombre: 'Crear y/o actualizar modulos o servicios por usuario', //add
  //   key: 'canCreate_ServiceU',
  //   detalle:
  //     'Te permite crear y/o actualizar los modulos o servicios por usuario solo en la entidad usuario.',
  //   categoria: CATEGORIA_4,
  // },
];
