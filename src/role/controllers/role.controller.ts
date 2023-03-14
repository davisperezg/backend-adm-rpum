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
  Patch,
} from '@nestjs/common';
import { QueryToken } from 'src/auth/dto/queryToken';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { CreateRolDTO } from '../dto/create-rol';
import { UpdateRolDTO } from '../dto/update-rol';
import { Role } from '../schemas/role.schema';
import { RoleService } from '../services/role.service';

//base: http://localhost:3000/api/v1/roles
@Controller('api/v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // Get Roles: http://localhost:3000/api/v1/roles
  @Get()
  @UseGuards(PermissionGuard(Permission.ReadRoles))
  getRoles(@CtxUser() user: QueryToken) {
    return this.roleService.findAll(user);
  }

  // Get Role: http://localhost:3000/api/v1/roles/find/6223169df6066a084cef08c2
  // @Get(':id')
  // @UseGuards(PermissionGuard(Permission.GetOneRole))
  // getRole(
  //   @Param('id') id: number,
  //   //@CtxUser() user: any
  // ) {
  //   return this.roleService.buscarRolXId(id);
  // }

  // Add Role(POST): http://localhost:3000/api/v1/roles/6223169df6066a084cef08c2
  @Post()
  @UseGuards(PermissionGuard(Permission.CreateRoles))
  async createRole(
    @Res() res,
    @Body() createBody: CreateRolDTO,
    @CtxUser() user: QueryToken,
  ) {
    const role = await this.roleService.create(createBody, user);
    return res.status(HttpStatus.OK).json({
      message: 'Role Successfully Created',
      role,
    });
  }

  // Update Role(PUT): http://localhost:3000/api/v1/roles/6223169df6066a084cef08c2
  @Put(':id')
  @UseGuards(PermissionGuard(Permission.UpdateRoles))
  async updateRole(
    @Res() res,
    @Param('id') id: number,
    @Body() createBody: UpdateRolDTO,
    @CtxUser() user: QueryToken,
  ) {
    const roleUpdated = await this.roleService.update(id, createBody, user);
    return res.status(HttpStatus.OK).json(roleUpdated);
  }

  // Delete Role(DELETE): http://localhost:3000/api/v1/roles/1
  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.DeleteRoles))
  async deleteRole(@Res() res, @Param('id') id: number): Promise<boolean> {
    const response = await this.roleService.delete(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El rol ha sido deshabilitado correctamente'
        : 'Mantenimiento',
    });
  }

  // Restore Role(PUT): http://localhost:3000/api/v1/roles/restore/1
  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.RestoreRoles))
  async restoreRole(@Res() res, @Param('id') id: number): Promise<Role> {
    const response = await this.roleService.restore(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El rol ha sido habiliado correctamente'
        : 'Mantenimiento',
    });
  }
}
