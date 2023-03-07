import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'aux_servicios_user' })
export class AuxServicesUserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @ManyToOne(() => UserEntity, (user) => user.aux_users_service)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ModuloEntity, (modulo) => modulo.modulos_service)
  @JoinColumn({ name: 'service_id' })
  modulos: ModuloEntity;
}
