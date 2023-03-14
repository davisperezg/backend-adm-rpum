import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CategoriaPermsisosEntity } from './categoria/entity/categoria.entity';
import {
  CATEGORIA_1,
  CATEGORIA_2,
  CATEGORIA_3,
  CATEGORIA_4,
  MOD_PRINCIPAL,
  RECURSOS_DEFECTOS,
  ROL_PRINCIPAL,
} from './lib/const/consts';
import { hashPassword } from './lib/helpers/auth.helper';
import { MenuEntity } from './menu/entity/menu.entity';
import { ModuloEntity } from './module/entity/modulo.entity';
import { PermisosEntity } from './resource/entity/permisos.entity';
import { PermisosRolEntity } from './resources-roles/entity/recursos-roles.entity';
import { PermisosUserEntity } from './resources-users/entity/recursos-users.entity';
import { RolEntity } from './role/entity/rol.entity';
import { ServicesUserEntity } from './services-users/entity/servicios-user.entity';
import { UserEntity } from './user/enitty/user.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(RolEntity)
    private rolRepository: Repository<RolEntity>,
    @InjectRepository(ModuloEntity)
    private moduloRepository: Repository<ModuloEntity>,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(CategoriaPermsisosEntity)
    private categoriaRepository: Repository<CategoriaPermsisosEntity>,
    @InjectRepository(PermisosEntity)
    private permisosRepository: Repository<PermisosEntity>,
    @InjectRepository(PermisosRolEntity)
    private prRepository: Repository<PermisosRolEntity>,
    @InjectRepository(PermisosUserEntity)
    private puRepository: Repository<PermisosUserEntity>,
    @InjectRepository(ServicesUserEntity)
    private suRepository: Repository<ServicesUserEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.init();
  }

  private async init() {
    //Si ya existe un usuario ya no lo creamos
    const count = await this.userRepository.count();

    if (count > 0) return;

    //Insertamos y guardamos todos los permisos
    const permisos = await this.permisosRepository.save(RECURSOS_DEFECTOS);

    //Insertamos categorias por defecto de los permisos
    const nuevaCategoria = new CategoriaPermsisosEntity();
    nuevaCategoria.nombre = CATEGORIA_1;
    nuevaCategoria.permisos = permisos
      .filter((a) => a.categoria === CATEGORIA_1)
      .map((b) => {
        return {
          id: b.id,
          nombre: b.nombre,
          key: b.key,
          detalle: b.detalle,
        };
      });

    const nuevaCategoria2 = new CategoriaPermsisosEntity();
    nuevaCategoria2.nombre = CATEGORIA_2;
    nuevaCategoria2.permisos = permisos
      .filter((a) => a.categoria === CATEGORIA_2)
      .map((b) => {
        return {
          id: b.id,
          nombre: b.nombre,
          key: b.key,
          detalle: b.detalle,
        };
      });

    const nuevaCategoria3 = new CategoriaPermsisosEntity();
    nuevaCategoria3.nombre = CATEGORIA_3;
    nuevaCategoria3.permisos = permisos
      .filter((a) => a.categoria === CATEGORIA_3)
      .map((b) => {
        return {
          id: b.id,
          nombre: b.nombre,
          key: b.key,
          detalle: b.detalle,
        };
      });

    const nuevaCategoria4 = new CategoriaPermsisosEntity();
    nuevaCategoria4.nombre = CATEGORIA_4;
    nuevaCategoria4.permisos = permisos
      .filter((a) => a.categoria === CATEGORIA_4)
      .map((b) => {
        return {
          id: b.id,
          nombre: b.nombre,
          key: b.key,
          detalle: b.detalle,
        };
      });

    //Guardo las categorias con sus permisos
    await Promise.all([
      this.categoriaRepository.save(nuevaCategoria),
      this.categoriaRepository.save(nuevaCategoria2),
      this.categoriaRepository.save(nuevaCategoria3),
      this.categoriaRepository.save(nuevaCategoria4),
    ]);

    //Creo los menus por defecto
    const menu1 = new MenuEntity();
    menu1.nombre = 'Usuarios';
    menu1.link = 'usuarios';

    const menu2 = new MenuEntity();
    menu2.nombre = 'Roles';
    menu2.link = 'roles';

    const menu3 = new MenuEntity();
    menu3.nombre = 'Modulos';
    menu3.link = 'modulos';

    const menu4 = new MenuEntity();
    menu4.nombre = 'Permisos';
    menu4.link = 'permisos';

    //Guardo los menus por defecto
    const menus = await Promise.all([
      this.menuRepository.save(menu1),
      this.menuRepository.save(menu2),
      this.menuRepository.save(menu3),
      this.menuRepository.save(menu4),
    ]);

    const menus2 = await Promise.all([this.menuRepository.save(menu1)]);

    //Inserto el modulo x defecto
    const nuevoModulo = new ModuloEntity();
    nuevoModulo.nombre = MOD_PRINCIPAL;
    nuevoModulo.menus = menus;
    nuevoModulo.user_create = null;

    const nuevoModulo2 = new ModuloEntity();
    nuevoModulo2.nombre = 'test';
    nuevoModulo2.menus = menus2;
    nuevoModulo2.user_create = null;

    //Guardo los modulos x defecto
    const modulos = await Promise.all([
      this.moduloRepository.save(nuevoModulo),
      this.moduloRepository.save(nuevoModulo2),
    ]);

    //Insertar los modulos x defecto al rol
    const nuevoRol = new RolEntity();
    nuevoRol.nombre = ROL_PRINCIPAL;
    nuevoRol.modulos = modulos;
    nuevoRol.user_create = null;

    //Guardo rol con los modulos x defecto
    const rol = await this.rolRepository.save(nuevoRol);

    //Insertamos y guardamos los permisos al rol
    permisos.map(async (_, i) => {
      const prCreado = this.prRepository.create({
        permiso: permisos[i],
        rol,
      });
      await this.prRepository.save(prCreado);
    });

    //Insertar usuario x defecto
    const nuevoUsuario = new UserEntity();
    nuevoUsuario.nombres = 'DAVIS KEINER';
    nuevoUsuario.apellidos = 'PEREZ GUZMAN';
    nuevoUsuario.dni = '72231218';
    nuevoUsuario.email = '12';
    nuevoUsuario.contrasenia = await hashPassword('12');
    nuevoUsuario.rol = rol;

    //Guardamos el usuario
    const usuario = await this.userRepository.save(nuevoUsuario);

    //Insertamos y guardamos los modulos del usuario
    modulos.map(async (_, i) => {
      const suCreado = this.suRepository.create({
        user: usuario,
        modulos: modulos[i],
      });
      await this.suRepository.save(suCreado);
    });

    //Insertamos y guardamos los permisos al usuario
    permisos.map(async (a, i) => {
      const puCreado = this.puRepository.create({
        permiso: permisos[i],
        user: usuario,
      });
      await this.puRepository.save(puCreado);
    });
  }

  getHello(): string {
    return 'API funcionando correctamente!!';
  }
}
