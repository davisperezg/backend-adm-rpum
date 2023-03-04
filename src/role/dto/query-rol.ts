export class QueryRol {
  id?: number;
  nombre?: string;
  detalle?: string;
  estado?: boolean;
  fecha_creada?: Date;
  fecha_modificada?: Date;
  modulos?: {
    id: number;
    nombre: string;
  }[];
  duenio?: string;
}
