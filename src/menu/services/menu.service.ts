import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Menu, MenuDocument } from '../schemas/menu.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MenuEntity } from '../entity/menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity) private menuModel: Repository<MenuEntity>,
  ) {}

  // async onModuleInit() {
  //   const count = await this.menuModel.count();
  //   if (count > 0) return;

  //   try {
  //     //await this.menuModel.updateMany({ status: null }, { status: true });

  //     const menu1 = new MenuEntity();
  //     menu1.nombre = 'Usuarios';
  //     menu1.link = 'usuarios';

  //     const menu2 = new MenuEntity();
  //     menu2.nombre = 'Roles';
  //     menu2.link = 'roles';

  //     const menu3 = new MenuEntity();
  //     menu3.nombre = 'Modulos';
  //     menu3.link = 'modulos';

  //     const menu4 = new MenuEntity();
  //     menu4.nombre = 'Permisos';
  //     menu4.link = 'permisos';

  //     await Promise.all([
  //       this.menuModel.save(menu1),
  //       this.menuModel.save(menu2),
  //       this.menuModel.save(menu3),
  //       this.menuModel.save(menu4),
  //     ]);
  //   } catch (e) {
  //     throw new Error(`Error en MenuService.onModuleInit ${e}`);
  //   }
  // }

  // async create(createMenu: Menu, user: any): Promise<Menu> {
  //   const { findUser } = user;

  //   if (findUser.role !== 'OWNER') {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNAUTHORIZED,
  //         type: 'UNAUTHORIZED',
  //         message: 'Unauthorized Exception',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   const { link } = createMenu;
  //   const modifyData = {
  //     ...createMenu,
  //     link: link.toLowerCase(),
  //     status: true,
  //   };

  //   return await this.menuModel.save(modifyData);
  // }

  //Put
  // async update(id: number, bodyMenu: Menu, user: any): Promise<Menu> {
  //   const { findUser } = user;
  //   if (findUser.role !== 'OWNER') {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNAUTHORIZED,
  //         type: 'UNAUTHORIZED',
  //         message: 'Unauthorized Exception',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   const { status } = bodyMenu;

  //   if (status) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNAUTHORIZED,
  //         type: 'UNAUTHORIZED',
  //         message: 'Unauthorized Exception',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   //await this.menuModel.update(id, bodyMenu)
  //   return;
  // }

  //Delete
  // async delete(id: string, user: any): Promise<boolean> {
  //   const { findUser } = user;
  //   if (findUser.role !== 'OWNER') {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNAUTHORIZED,
  //         type: 'UNAUTHORIZED',
  //         message: 'Unauthorized Exception',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   let result = false;

  //   try {
  //     await this.menuModel.update(id, { status: false });
  //     result = true;
  //   } catch (e) {
  //     throw new Error(`Error en MenuService.delete ${e}`);
  //   }

  //   return result;
  // }

  async findAll(): Promise<MenuEntity[]> {
    return await this.menuModel.find({
      where: { estado: true },
    });
  }

  async findByIds(idList: number[]): Promise<MenuEntity[]> {
    /**
     *  Otro metodo
     *const query = this.menuModel.createQueryBuilder('menus');
     *return await query.where('menus.id IN (:...idList)', { idList })
     .getMany();
     */

    let menus = [];
    let validarLista: boolean;

    try {
      const listaMenus = await this.menuModel.findBy({ id: In(idList) });
      const idsListaMenus = listaMenus.map((a) => a.id);
      validarLista = idList.every((x) => idsListaMenus.includes(x));

      menus = listaMenus;
    } catch (e) {
      throw new HttpException(
        'Ocurrio un error al intentar obtener ids de menus - Informar cod_error: MenuService.findByIds.findBy',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //Si es false = se encontro un 1 o mas menu no registrado en el body
    if (!validarLista)
      throw new HttpException(
        'Se encontró menu(s) no disponible',
        HttpStatus.BAD_REQUEST,
      );

    return menus;
  }

  // async findbyName(name: any[]): Promise<any[]> {
  //   return;
  // }

  //Restore
  // async restore(id: string, user: any): Promise<boolean> {
  //   const { findUser } = user;
  //   if (findUser.role !== 'OWNER') {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNAUTHORIZED,
  //         type: 'UNAUTHORIZED',
  //         message: 'Unauthorized Exception',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   let result = false;

  //   try {
  //     await this.menuModel.update(id, { status: true });
  //     result = true;
  //   } catch (e) {
  //     throw new Error(`Error en MenuService.restore ${e}`);
  //   }

  //   return result;
  // }
}
