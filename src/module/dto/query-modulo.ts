export class QueryModulo {
  id?: number;
  nombre?: string;
  detalle?: string;
  link?: string;
  color?: string;
  icon?: string;
  estado?: boolean;
  fecha_creada?: Date;
  fecha_modificada?: Date;
  menus?: {
    id: number;
    nombre: string;
  }[];
  duenio?: string;
}
