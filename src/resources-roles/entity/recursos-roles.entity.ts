import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { PermisosEntity } from 'src/resource/entity/permisos.entity';
import { RolEntity } from 'src/role/entity/rol.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'permisos_rol' })
export class PermisosRolEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @ManyToOne(() => RolEntity, (rol) => rol.roles_permiso)
  @JoinColumn({ name: 'rol_id' })
  rol: RolEntity;

  @ManyToOne(() => PermisosEntity, (permiso) => permiso.permisos_roles)
  @JoinColumn({ name: 'permiso_id' })
  permiso: PermisosEntity;
}
