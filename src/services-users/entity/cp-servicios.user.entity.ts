import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'aux_modulos_user' })
export class AuxServicesUserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.aux_users_service, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ModuloEntity, (modulo) => modulo.modulos_service, {
    nullable: false,
  })
  @JoinColumn({ name: 'modulo_id' })
  modulos: ModuloEntity;
}
