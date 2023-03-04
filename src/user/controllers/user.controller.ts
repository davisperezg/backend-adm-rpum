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
import { User, UserDocument } from '../schemas/user.schema';
import { CtxUser } from 'src/lib/decorators/ctx-user.decorators';
import { JwtAuthGuard } from 'src/lib/guards/auth.guard';
import PermissionGuard from 'src/lib/guards/resources.guard';
import Permission from 'src/lib/type/permission.type';
import { CreateUserDTO } from '../dto/create-user';

//base: http://localhost:3000/api/v1/users
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get Users: http://localhost:3000/api/v1/users
  @Get()
  //@UseGuards(PermissionGuard(Permission.ReadUsers))
  getUsers() {
    //@CtxUser() user: any
    return this.userService.findAll();
  }

  // Get User: http://localhost:3000/api/v1/users/find/6223169df6066a084cef08c2
  @Get(':id')
  //@UseGuards(PermissionGuard(Permission.GetOneUser))
  getUser(@Param('id') id: number) {
    return this.userService.findUserByCodApi(id);
  }

  // Get users removes: http://localhost:3000/api/v1/users/removes
  // @Get('/removes')
  // getUsersRemoves() {
  //   return this.userService.findAllDeleted();
  // }

  // Get Me: http://localhost:3000/api/v1/users/whois
  @Get('/whois')
  //@UseGuards(JwtAuthGuard)
  whois(
    @Res() res,
    //@CtxUser() user: any
  ): Promise<UserDocument> {
    //const { findUser } = user;
    return res.status(HttpStatus.OK).json({ user: 'findUser' });
  }

  // Add User(POST): http://localhost:3000/api/v1/users
  @Post()
  //@UseGuards(PermissionGuard(Permission.CreateUser))
  async createUser(
    @Res() res,
    @Body() createBody: CreateUserDTO,
    //@CtxUser() userToken: any,
  ): Promise<CreateUserDTO> {
    const user = await this.userService.create(createBody);
    return res.status(HttpStatus.OK).json({
      message: 'User Successfully Created',
      user,
    });
  }

  // Update User(PUT): http://localhost:3000/api/v1/users/6223169df6066a084cef08c2
  @Put(':id')
  //@UseGuards(PermissionGuard(Permission.UpdateUser))
  async updateUser(
    @Res() res,
    @Param('id') id: string,
    @Body() createBody: User,
    //@CtxUser() user: any,
  ): Promise<User> {
    const userUpdated = await this.userService.update(id, createBody);
    return res.status(HttpStatus.OK).json({
      message: 'User Updated Successfully',
      userUpdated,
    });
  }

  // Update User(PUT): http://localhost:3000/api/v1/users/change-password/6223169df6066a084cef08c2
  @Put('/change-password/:id')
  //@UseGuards(PermissionGuard(Permission.ChangePasswordUser))
  async changeUser(
    @Res() res,
    @Param('id') id: string,
    @Body()
    data: {
      password: string;
    },
    //@CtxUser() userToken: any,
  ): Promise<User> {
    const passwordUpdated = await this.userService.changePassword(
      id,
      data,
      //userToken,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Password Updated Successfully',
      passwordUpdated,
    });
  }

  // Delete User(DELETE): http://localhost:3000/api/v1/users/6223169df6066a084cef08c2
  @Delete(':id')
  //@UseGuards(PermissionGuard(Permission.DeleteUser))
  async deleteUser(
    @Res() res,
    @Param('id') id: number,
    //@CtxUser() user: any,
  ): Promise<boolean> {
    const response = await this.userService.delete(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El usuario ha sido deshabilitado correctamente'
        : 'Mantenimiento',
    });
  }

  // Restore User: http://localhost:3000/api/v1/users/restore/6223169df6066a084cef08c2
  @Patch(':id')
  //@UseGuards(PermissionGuard(Permission.RestoreUser))
  async restoreUser(
    @Res() res,
    @Param('id') id: number,
    //  @CtxUser() user: any,
  ): Promise<User> {
    const response = await this.userService.restore(id);
    return res.status(HttpStatus.OK).json({
      CodRspuesta: response ? 0 : 1,
      MensajeRespuesta: response
        ? 'El usuario ha sido habiliado correctamente'
        : 'Mantenimiento',
    });
  }
}
