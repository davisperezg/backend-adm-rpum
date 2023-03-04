import { UpdateModuloDTO } from './../dto/update-modulo';
import { CreateModuloDTO } from './../dto/create-modulo';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { Module } from '../schemas/module.schema';
import { ModuleService } from '../services/module.service';
import { Request } from 'express';

//base: http://localhost:3000/api/v1/modules
@Controller('api/v1/modulos')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  // Get Modules: http://localhost:3000/api/v1/modules
  @Get()
  //@UseGuards(PermissionGuard(Permission.ReadModuleItem))
  getModules() {
    //@CtxUser() user: any
    return this.moduleService.findAll();
  }

  // Get Modules: http://localhost:3000/api/v1/modules/list
  @Get('/list')
  //@UseGuards(PermissionGuard(Permission.ReadModuleList))
  getModulesList() {
    //@CtxUser() user: any
    return this.moduleService.listModules();
  }

  // Get Module: http://localhost:3000/api/v1/modules/find/6223169df6066a084cef08c2
  @Get(':id')
  //@UseGuards(PermissionGuard(Permission.GetOneModule))
  getModule(@Param('id') id: number) {
    return this.moduleService.buscarModuloXid(id);
  }

  // Add Module(POST): http://localhost:3000/api/v1/modules
  @Post()
  //@UseGuards(PermissionGuard(Permission.CreateModule))
  async createMenu(
    @Res() res,
    @Body() createModule: CreateModuloDTO,
    //@CtxUser() user: any,
  ) {
    const response = await this.moduleService.create(createModule);
    return res.status(201).json(response);
  }

  // Update Module(PUT): http://localhost:3000/api/v1/modules/605ab8372ed8db2ad4839d87
  @Put(':id')
  //@UseGuards(PermissionGuard(Permission.EditModule))
  async updateModule(
    @Res() res,
    @Param('id') id: number,
    @Body() createMenu: UpdateModuloDTO,
    @Req() req: Request,
    //@CtxUser() user: any,
  ) {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = forwardedFor
      ? (forwardedFor as string).split(',')[0]
      : req.socket.remoteAddress;

    const moduleUpdated = await this.moduleService.update(id, createMenu, ip);
    return res.status(HttpStatus.OK).json({
      message: 'Module Updated Successfully',
      moduleUpdated,
    });
  }

  // Delete Module(DELETE): http://localhost:3000/api/v1/modules/605ab8372ed8db2ad4839d87
  @Delete(':id')
  //@UseGuards(PermissionGuard(Permission.DeleteModule))
  async deleteModule(@Res() res, @Param('id') id: number): Promise<boolean> {
    const response = await this.moduleService.delete(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El módulo ha sido deshabilitado correctamente'
        : 'Mantenimiento',
    });
  }

  // Restore Module(PUT): http://localhost:3000/api/v1/modules/restore/605ab8372ed8db2ad4839d87
  @Patch(':id')
  //@UseGuards(PermissionGuard(Permission.RestoreModule))
  async restoreModule(@Res() res, @Param('id') id: number): Promise<Module> {
    const response = await this.moduleService.restore(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El módulo ha sido habiliado correctamente'
        : 'Mantenimiento',
    });
  }
}
