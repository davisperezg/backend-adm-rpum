import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { ModuleModule } from './module/module.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { ResourceModule } from './resource/resource.module';
import { AuthModule } from './auth/auth.module';
import { ResourcesRolesModule } from './resources-roles/resources-roles.module';
import { ResourcesUsersModule } from './resources-users/resources-users.module';
import { ServicesUsersModule } from './services-users/services-users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationErrorFilter } from './lib/class-validator/validation-error.filter';
import { APP_FILTER } from '@nestjs/core';
import { UserEntity } from './user/enitty/user.entity';
import { RolEntity } from './role/entity/rol.entity';
import { ModuloEntity } from './module/entity/modulo.entity';
import { MenuEntity } from './menu/entity/menu.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.TYPE_DATABASE,
      host: process.env.HOST_DATABASE,
      port: process.env.PORT_DATABASE,
      username: process.env.USER_DATABASE,
      password: process.env.PASSWORD_DATABASE,
      database: process.env.NAME_DATABASE,
      synchronize: process.env.NODE_ENV == 'development' ? true : false,
      retryAttempts: 3,
      autoLoadEntities: true,
      logging: ['error', 'warn', 'info'],
      maxQueryExecutionTime: 1000,
    } as any),
    UserModule,
    RoleModule,
    // ResourceModule,
    //MenuModule,
    ModuleModule,
    // AuthModule,
    // ResourcesRolesModule,
    // ResourcesUsersModule,
    // ServicesUsersModule,
    TypeOrmModule.forFeature([UserEntity, RolEntity, ModuloEntity, MenuEntity]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ValidationErrorFilter,
    },
  ],
})
export class AppModule {}
