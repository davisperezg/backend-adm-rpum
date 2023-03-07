import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { PermisosEntity } from 'src/resource/entity/permisos.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'permisos_user' })
export class PermisosUserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.users_permiso)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PermisosEntity, (modulo) => modulo.permisos_user)
  @JoinColumn({ name: 'permiso_id' })
  permiso: PermisosEntity;
}
