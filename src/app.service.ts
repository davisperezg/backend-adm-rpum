import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MOD_PRINCIPAL, ROL_PRINCIPAL } from './lib/const/consts';
import { hashPassword } from './lib/helpers/auth.helper';
import { MenuEntity } from './menu/entity/menu.entity';
import { ModuloEntity } from './module/entity/modulo.entity';
import { RolEntity } from './role/entity/rol.entity';
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
  ) {}

  async onApplicationBootstrap() {
    await this.init();
  }

  private async init() {
    const count = await this.userRepository.count();
    if (count > 1) return;

    //Creo los menus
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

    //Guardo los menus
    const menus = await Promise.all([
      this.menuRepository.save(menu1),
      this.menuRepository.save(menu2),
      this.menuRepository.save(menu3),
      this.menuRepository.save(menu4),
    ]);

    //Inserto el modulo default
    const nuevoModulo = new ModuloEntity();
    nuevoModulo.nombre = MOD_PRINCIPAL;
    nuevoModulo.menus = menus;
    nuevoModulo.user_create = null;

    //Guardo los modulos default
    const modulos = await Promise.all([
      this.moduloRepository.save(nuevoModulo),
    ]);

    //Insertar los modulos default al rol
    const nuevoRol = new RolEntity();
    nuevoRol.nombre = ROL_PRINCIPAL;
    nuevoRol.modulos = modulos;
    nuevoRol.user_create = null;

    //Guardo rol con los modulos default
    const rol = await this.rolRepository.save(nuevoRol);

    //Insertar usuario default
    const nuevoUsuario = new UserEntity();
    nuevoUsuario.nombres = 'DAVIS KEINER';
    nuevoUsuario.apellidos = 'PEREZ GUZMAN';
    nuevoUsuario.dni = '72231218';
    nuevoUsuario.email = '12';
    nuevoUsuario.contrasenia = await hashPassword('12');
    nuevoUsuario.rol = rol;

    //Guardamos el usuario
    await this.userRepository.save(nuevoUsuario);
  }

  getHello(): string {
    return 'API funcionando correctamente!!';
  }
}
