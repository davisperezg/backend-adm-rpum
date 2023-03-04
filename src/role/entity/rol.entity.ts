import { ModuloEntity } from 'src/module/entity/modulo.entity';
import { UserEntity } from 'src/user/enitty/user.entity';
import { User } from 'src/user/schemas/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class RolEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 45 })
  nombre: string;

  @Column({ length: 150 })
  detalle?: string;

  @Column({ default: true })
  estado?: boolean;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // duenio: User;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt?: Date;

  @ManyToMany(() => ModuloEntity, (modulo) => modulo.roles)
  @JoinTable({
    name: 'roles_modulos',
    joinColumn: {
      name: 'rol_id',
    },
    inverseJoinColumn: {
      name: 'modulo_id',
    },
  })
  modulos: ModuloEntity[];

  @OneToMany(() => UserEntity, (user) => user.rol)
  usuarios?: UserEntity[];

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
