import {
  CopyServices_User,
  CopyServicesDocument,
} from './../schemas/cp-services-user';
import {
  Services_User,
  Services_UserDocument,
} from './../schemas/services-user';
import {
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/services/user.service';
import { ModuleService } from 'src/module/services/module.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ServicesUserEntity } from '../entity/servicios-user.entity';
import { AuxServicesUserEntity } from '../entity/cp-servicios.user.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import { ServiceUserDTO } from '../dto/create-su';
import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { MOD_PRINCIPAL } from 'src/lib/const/consts';

@Injectable()
export class ServicesUsersService {
  constructor(
    @InjectRepository(ServicesUserEntity)
    private suModel: Repository<ServicesUserEntity>,
    @InjectRepository(AuxServicesUserEntity)
    private copySuModel: Repository<AuxServicesUserEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ModuloEntity)
    private readonly moduloRepository: Repository<ModuloEntity>, // @InjectModel(Services_User.name)
  ) {} // private suModel: Model<Services_UserDocument>,

  // @Inject(forwardRef(() => ModuleService))
  // private readonly moduleService: ModuleService,
  // @InjectModel(CopyServices_User.name)
  // private copySuModel: Model<CopyServicesDocument>,

  async findModulesByUser(idUser: number) {
    const users_modulos = await this.suModel.find({
      select: {
        id: false,
        user: {},
        modulos: {
          id: true,
          nombre: true,
          estado: true,
          menus: {
            id: true,
            nombre: true,
            link: true,
          },
        },
      },
      relations: {
        user: true,
        modulos: {
          menus: true,
        },
      },
      where: {
        user: { id: idUser },
        estado: true,
      },
    });

    const propiedadesAQuitar = ['estado', 'id'];

    const nuevoArray = users_modulos.map((a) => {
      propiedadesAQuitar.forEach((b) => delete a[b]);
      return a;
    });

    return nuevoArray;
  }

  //Add a single module_user
  async create(createSU: ServiceUserDTO) {
    const { user, modulos } = createSU;

    const findIfExisteUser = await this.userRepository.findOne({
      where: {
        id: user,
      },
    });

    if (!findIfExisteUser) {
      throw new HttpException('El usuario no existe', HttpStatus.BAD_REQUEST);
    }

    //buscar modulos de usuario existente
    const isExistsSU = await this.suModel.findOne({
      where: {
        user: {
          id: user,
        },
      },
    });

    if (isExistsSU) {
      const bodyExists = {
        ...createSU,
        user,
        modulos,
      };

      return await this.update(isExistsSU.id, bodyExists);
    }

    const findModulesBody = await this.moduloRepository.find({
      where: {
        id: In(modulos),
      },
    });

    findModulesBody.map(async (a, i) => {
      const crear = this.suModel.create({
        user: findIfExisteUser,
        modulos: findModulesBody[i],
      });
      await this.suModel.save(crear);
    });

    return;
  }

  async update(id: number, bodySU: ServiceUserDTO) {
    const { user, modulos } = bodySU;

    let findServiceToData;

    //validamos si el servicio no existe o esta inactivo
    const findSU = await this.suModel.findOne({
      where: {
        id,
      },
    });

    if (!findSU) {
      throw new HttpException(
        'El servicio no existe o esta inactivo',
        HttpStatus.BAD_REQUEST,
      );
    }

    let isExistsUserinSU;
    //ejecutar codigo si existe usuario en el body
    if (user) {
      try {
        //buscar servicio existente por usuario
        isExistsUserinSU = await this.suModel.findOne({
          where: {
            user: {
              id: user,
            },
          },
        });
      } catch (e) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            type: 'BAD_REQUEST',
            message: `No hay un servicio registrado con ese usuario.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      //si existe en la bd pero no coincide con el param id
      if (id !== isExistsUserinSU.id) {
        throw new HttpException(
          'El id no coincide con el usuario ingresado',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const findModules = await this.moduloRepository.find({
      where: {
        id: In(modulos),
      },
    });

    const isExisteModuleASP = findModules.some(
      (a) => a.nombre === MOD_PRINCIPAL,
    );

    if (isExisteModuleASP) {
      throw new HttpException(
        'Por seguridad tomares tu ip',
        HttpStatus.UNAUTHORIZED,
      );
    }

    //si no existe buscar su mismo usuario y serivicio registrado
    const { user: userRegistered, modulos: servicesRegistered } = findSU;

    //si existe servicios en el body, buscar los ids
    if (modulos.length > 0) {
      findServiceToData = await this.moduloRepository.find({
        where: {
          id: In(modulos),
        },
      });
    }

    //si no existe servicios ni usuario en el body usar los mismo registrados
    const modifyData = {
      ...bodySU,
      user: user ? (isExistsUserinSU as UserEntity) : userRegistered,
      //modulos: modulos ? findServiceToData : servicesRegistered,
    };

    //lo formateo para poder hacer la consulta con los registrado
    // const formatRegistered = servicesRegistered.map((res) => res.id);
    // const formatSendData = findServiceToData.map((res) => res.id);

    //validamos si ya existe el recurso modificado en el esquema copyresource_user
    const isExistServicesModified = await this.copySuModel.findOne({
      where: {
        user: {
          id: modifyData.user.id,
        },
      },
    });

    let enviarModificados = [];

    // //si modificados esta vacio o no se encuentra en la bd se crea
    //  if (!isExistServicesModified) {
    //    const desactivando = formatRegistered.filter(
    //      (a) => !formatSendData.includes(a),
    //    );
    //   const activando = formatSendData.filter(
    //     (a) => !formatRegistered.includes(a),
    //   );
    //   const iranAModificados = desactivando.concat(activando);

    //   const findResourceToDataRU = await this.moduleService.findModulesIds(
    //     iranAModificados,
    //   );

    //   await new this.copySuModel({
    //     status: true,
    //     user: modifyData.user,
    //     module: findResourceToDataRU,
    //   }).save();
    // } else {
    //   const formatRegisteredModifieds = isExistServicesModified.module.map(
    //     (res) => String(res),
    //   );

    //   //si entrada es vacio todos los que estabn reigstrado se filtro con los modificados para obtener quienes faltan modificarse
    //   if (formatSendData.length === 0) {
    //     if (formatRegisteredModifieds.length === formatRegistered.length) {
    //       //validamos si los elementos registrados tienen el mismo valor con los modificados
    //       const modificadosExistsInRegistrado = formatRegisteredModifieds.every(
    //         (a) => formatRegistered.includes(a),
    //       );
    //       //si es true envia la misma data de modificados
    //       //si es false buscara los registros que no estan en modificados
    //       if (modificadosExistsInRegistrado) {
    //         enviarModificados = [];
    //       } else {
    //         enviarModificados = formatRegistered.filter(
    //           (a) => !formatRegisteredModifieds.includes(a),
    //         );
    //       }
    //     }

    //     if (formatRegisteredModifieds.length > formatRegistered.length) {
    //       //validamos si los elementos modificados contiene el mismo valor con los registrados
    //       const modificadosExistsInRegistrado = formatRegistered.every((a) =>
    //         formatRegisteredModifieds.includes(a),
    //       );

    //       enviarModificados = modificadosExistsInRegistrado && [];
    //     }

    //     if (formatRegistered.length > formatRegisteredModifieds.length) {
    //       //buscamos si los elementos registrados contiene el diferentes valores con los registrados
    //       enviarModificados = formatRegistered.filter(
    //         (a) => !formatRegisteredModifieds.includes(a),
    //       );
    //     }
    //   }

    //   if (formatSendData.length > 0) {
    //     if (
    //       formatSendData.length === formatRegisteredModifieds.length &&
    //       formatSendData.length === formatRegistered.length
    //     ) {
    //       const buscarIgualdadconRes = formatSendData.every((a) =>
    //         formatRegistered.includes(a),
    //       );
    //       const buscarIgualdadconMod = formatSendData.every((a) =>
    //         formatRegisteredModifieds.includes(a),
    //       );
    //       //si los datos coinciden entrada y registrados la data de modificados permanece
    //       if (buscarIgualdadconRes && buscarIgualdadconMod) {
    //         enviarModificados = [];
    //       }
    //       if (
    //         buscarIgualdadconRes === false &&
    //         buscarIgualdadconMod === false
    //       ) {
    //         enviarModificados = formatSendData.filter(
    //           (a) => !formatRegisteredModifieds.includes(a),
    //         );
    //       }
    //       if (buscarIgualdadconRes === true && buscarIgualdadconMod === false) {
    //         enviarModificados = formatSendData.filter(
    //           (a) => !formatRegisteredModifieds.includes(a),
    //         );
    //       }
    //       if (buscarIgualdadconRes === false && buscarIgualdadconMod === true) {
    //         enviarModificados = [];
    //       }
    //     } else {
    //       //buscamos los recursos que fueron desactivados, activados y hacemos un filtro con los recursos modificados.
    //       const desactivando = formatRegistered.filter(
    //         (a) => !formatSendData.includes(a),
    //       );
    //       const activando = formatSendData.filter(
    //         (a) => !formatRegistered.includes(a),
    //       );
    //       const unir = desactivando.concat(activando);
    //       enviarModificados = unir.filter(
    //         (a) => !formatRegisteredModifieds.includes(a),
    //       );
    //     }
    //   }

    //   //busca los recursos segun los id quue recibe
    //   const finServicesToDataSU = await this.moduleService.findModulesIds(
    //     formatRegisteredModifieds.concat(enviarModificados),
    //   );

    //   //enviar al esquema modificados
    //   const sendDataToModified: CopyServices_User = {
    //     status: true,
    //     user: modifyData.user,
    //     module: finServicesToDataSU,
    //   };

    //   await this.copySuModel.findOneAndUpdate(
    //     { user: sendDataToModified.user },
    //     {
    //       module: sendDataToModified.module,
    //     },
    //     { new: true },
    //   );
    // }

    // return await this.suModel.findByIdAndUpdate(id, modifyData, {
    //   new: true,
    // });
    return;
  }
}
