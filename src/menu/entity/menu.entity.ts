import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity({ name: 'menus' })
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ unique: true })
  link: string;

  @Column({ default: true, nullable: true })
  estado: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;

  // @ManyToOne(() => ModuloEntity, (modulo) => modulo.menus, {
  //   nullable: true,
  // })
  // modulo?: ModuloEntity;

  @ManyToMany(() => ModuloEntity, (modulo) => modulo.menus)
  modulos?: ModuloEntity[];
}
