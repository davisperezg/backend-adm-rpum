import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { AuxPermisosUserEntity } from 'src/resources-users/entity/cp-recursos.user.entity';
import { PermisosUserEntity } from 'src/resources-users/entity/recursos-users.entity';
import { RolEntity } from 'src/role/entity/rol.entity';
import { AuxServicesUserEntity } from 'src/services-users/entity/cp-servicios.user.entity';
import { ServicesUserEntity } from 'src/services-users/entity/servicios-user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 20 })
  dni: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 200, select: false })
  contrasenia: string;

  @Column({ length: 9 })
  telefono_movil_1: string;

  @Column({ length: 9, nullable: true })
  telefono_movil_2?: string;

  @Column({ type: 'datetime', nullable: true })
  fecha_nacimiento?: Date;

  @Column({ type: 'blob', nullable: true })
  foto?: string;

  @Column({ default: true })
  estado?: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => RolEntity, (rol) => rol.usuarios, {
    nullable: false,
  })
  @JoinColumn({ name: 'rol_id' })
  rol: RolEntity;

  //Referencia a modulos
  @OneToOne(() => ModuloEntity, (mod) => mod.user_create)
  modulo_create: ModuloEntity;

  @OneToOne(() => ModuloEntity, (mod) => mod.user_delete)
  modulo_delete: ModuloEntity;

  @OneToOne(() => ModuloEntity, (mod) => mod.user_update)
  modulo_update: ModuloEntity;

  //Referencia a roles
  @OneToOne(() => RolEntity, (rol) => rol.user_create)
  rol_create: RolEntity;

  @OneToOne(() => RolEntity, (rol) => rol.user_delete)
  rol_delete: RolEntity;

  @OneToOne(() => RolEntity, (rol) => rol.user_update)
  rol_update: RolEntity;

  //Referencia a si mismo
  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_create' })
  user_create?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_delete' })
  user_delete?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_update' })
  user_update?: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_restore' })
  user_restore?: UserEntity;

  //Referencia a user x services_users
  @OneToMany(() => ServicesUserEntity, (service) => service.user)
  users_service?: ServicesUserEntity[];

  //Referencia a user x aux_services_users
  @OneToMany(() => AuxServicesUserEntity, (service) => service.user)
  aux_users_service?: AuxServicesUserEntity[];

  //Referencia a user x permisos_users
  @OneToMany(() => PermisosUserEntity, (service) => service.user)
  users_permiso?: PermisosUserEntity[];

  //Referencia a user x aux_permisos_users
  @OneToMany(() => AuxPermisosUserEntity, (service) => service.user)
  aux_users_permiso?: AuxPermisosUserEntity[];

  @BeforeUpdate()
  @BeforeInsert()
  trimProperties() {
    //const propertiesToExclude = ['no_trim_1', 'no_trim_2'];
    for (const key in this) {
      const value = this[key as keyof this];
      //typeof value === 'string' && !propertiesToExclude.includes(key)
      if (typeof value === 'string') {
        this[key as keyof this] = value.trim() as any;
      }
    }
  }
}
