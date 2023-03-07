import { PermisosEntity } from 'src/resource/entity/permisos.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'grupos' })
export class CategoriaPermsisosEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: true })
  estado?: boolean;

  @Column({ length: 50 })
  nombre: string;

  @ManyToMany(() => PermisosEntity, (permiso) => permiso.grupos)
  @JoinTable({
    name: 'grupos_permisos',
    joinColumn: {
      name: 'grupo_id',
    },
    inverseJoinColumn: {
      name: 'permiso_id',
    },
  })
  permisos: PermisosEntity[];
}
