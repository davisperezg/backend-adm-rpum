import { CategoriaPermsisosEntity } from 'src/categoria/entity/categoria.entity';
import { PermisosRolEntity } from 'src/resources-roles/entity/recursos-roles.entity';
import { AuxPermisosUserEntity } from 'src/resources-users/entity/cp-recursos.user.entity';
import { PermisosUserEntity } from 'src/resources-users/entity/recursos-users.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'permisos' })
export class PermisosEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @Column({ length: 70 })
  nombre: string;

  @Column({ unique: true, length: 50 })
  key: string;

  @Column({ length: 150 })
  detalle: string;

  //Referencia a user x aux_permisos_user
  @OneToMany(() => AuxPermisosUserEntity, (permiso) => permiso.user)
  aux_permisos_users?: AuxPermisosUserEntity[];

  //Referencia a user x permisos_roles
  @OneToMany(() => PermisosRolEntity, (permiso) => permiso.rol)
  permisos_roles?: PermisosRolEntity[];

  //Referencia a user x permisos_user
  @OneToMany(() => PermisosUserEntity, (permiso) => permiso.user)
  permisos_user?: PermisosUserEntity[];

  //Referencia a categorias
  @ManyToMany(() => CategoriaPermsisosEntity, (categoria) => categoria.permisos)
  grupos?: CategoriaPermsisosEntity[];
}
