import { UpdateUserDTO } from './../dto/update-user';
import { UserService } from '../services/user.service';
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
import { User } from '../schemas/user.schema';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { CreateUserDTO } from '../dto/create-user';
import { QueryToken } from 'src/auth/dto/queryToken';
import { ChangePasswordDTO } from '../dto/change-password';

//base: http://localhost:3000/api/v1/users
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get Users: http://localhost:3000/api/v1/users
  @Get()
  @UseGuards(PermissionGuard(Permission.ReadUsers))
  getUsers(@CtxUser() user: QueryToken) {
    return this.userService.findAll(user);
  }

  // Get User: http://localhost:3000/api/v1/users/1
  @Get('/get/:id')
  @UseGuards(PermissionGuard(Permission.GetOneUsers))
  getUser(@Param('id') id: number) {
    return this.userService.findUserById(id);
  }

  // Get Me: http://localhost:3000/api/v1/users/whois
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  whois(@Res() res, @CtxUser() user: QueryToken) {
    const { tokenUsuario } = user;
    return res.status(HttpStatus.OK).json(tokenUsuario);
  }

  // Add User(POST): http://localhost:3000/api/v1/users
  @Post()
  @UseGuards(PermissionGuard(Permission.CreateUsers))
  async createUser(
    @Res() res,
    @Body() createBody: CreateUserDTO,
    @CtxUser() userToken: QueryToken,
  ): Promise<CreateUserDTO> {
    const user = await this.userService.create(createBody, userToken);
    return res.status(HttpStatus.OK).json({
      message: 'User Successfully Created',
      user,
    });
  }

  // Update User(PUT): http://localhost:3000/api/v1/users/1
  @Put('/user/:id')
  @UseGuards(PermissionGuard(Permission.UpdateUsers))
  async updateUser(
    @Res() res,
    @Param('id') id: number,
    @Body() createBody: UpdateUserDTO,
    @CtxUser() user: QueryToken,
  ) {
    const userUpdated = await this.userService.update(id, createBody, user);
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      userUpdated,
    });
  }

  //Update User(Patch): http://localhost:3000/api/v1/users/change-password/1
  @Patch('/change-password/:id')
  @UseGuards(PermissionGuard(Permission.ChangePasswordUsers))
  async changeUser(
    @Res() res,
    @Param('id') id: number,
    @Body()
    data: ChangePasswordDTO,
    @CtxUser() userToken: QueryToken,
  ) {
    const { contrasenia } = data;

    const passwordUpdated = await this.userService.changePassword(
      id,
      contrasenia,
      userToken,
    );

    return res.status(HttpStatus.OK).json({
      message: 'Password Updated Successfully',
      passwordUpdated,
    });
  }

  // Delete User(DELETE): http://localhost:3000/api/v1/users/1
  @Delete(':id')
  @UseGuards(PermissionGuard(Permission.DeleteUsers))
  async deleteUser(
    @Res() res,
    @Param('id') id: number,
    @CtxUser() user: QueryToken,
  ): Promise<boolean> {
    const response = await this.userService.delete(id, user);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El usuario ha sido deshabilitado correctamente'
        : 'Mantenimiento',
    });
  }

  // Restore User: http://localhost:3000/api/v1/users/restore/1
  @Patch(':id')
  @UseGuards(PermissionGuard(Permission.RestoreUsers))
  async restoreUser(
    @Res() res,
    @Param('id') id: number,
    @CtxUser() user: QueryToken,
  ) {
    const response = await this.userService.restore(id, user);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El usuario ha sido habiliado correctamente'
        : 'Mantenimiento',
    });
  }
}
