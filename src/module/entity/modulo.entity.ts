import { MenuEntity } from 'src/menu/entity/menu.entity';
import { RolEntity } from 'src/role/entity/rol.entity';
import { AuxServicesUserEntity } from 'src/services-users/entity/cp-servicios.user.entity';
import { ServicesUserEntity } from 'src/services-users/entity/servicios-user.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'modulos' })
export class ModuloEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 45 })
  nombre: string;

  @Column({ nullable: true, length: 150 })
  detalle?: string;

  @Column({ nullable: true, unique: true, length: 100 })
  link?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ type: 'boolean', default: true })
  estado?: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  //Esta configuracion solo puede estar en 1 lado
  @ManyToMany(() => MenuEntity, (menu) => menu.modulos)
  @JoinTable({
    name: 'modulos_menus',
    joinColumn: {
      name: 'modulo_id',
    },
    inverseJoinColumn: {
      name: 'menu_id',
    },
  })
  menus?: MenuEntity[];

  @ManyToMany(() => RolEntity, (rol) => rol.modulos)
  roles?: RolEntity[];

  //Referencia a modulos x services_users
  @OneToMany(() => ServicesUserEntity, (service) => service.modulos)
  modulos_service?: ServicesUserEntity[];

  //Referencia a user x aux_services_users
  @OneToMany(() => AuxServicesUserEntity, (service) => service.modulos)
  aux_modulos_service?: AuxServicesUserEntity[];

  //Referencia a usuarios
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_create' })
  user_create?: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_delete' })
  user_delete?: UserEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_update' })
  user_update?: UserEntity;
}
