import {
  Matches,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  ValidateIf,
  IsArray,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
export class CreateRolDTO {
  @Matches(/^[A-Za-z0-9Ññ\s]+$/, {
    message:
      'El nombre del módulo solo puede contener letras y números sin tildes',
  })
  @MaxLength(45, {
    message: 'El nombre del rol debe ser igual o menor a 45 caracteres',
  })
  @MinLength(3, {
    message: 'El nombre del rol debe ser igual o mayor a 3 caracteres',
  })
  @IsString({
    message: 'El nombre del rol debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el nombre del rol' })
  nombre: string;

  //DETALLE
  @MaxLength(150, {
    message: 'El detalle del rol debe ser igual o menor a 150 caracteres',
  })
  @MinLength(3, {
    message: 'El detalle del rol debe ser igual o mayor a 3 caracteres',
  })
  @IsString({
    message: 'El detalle del rol debe contener una cadena de texto',
  })
  @IsOptional()
  detalle?: string;

  //MODULOS
  @IsNumber(
    {},
    { each: true, message: 'Los módulo del rol no contiene un id correcto' },
  )
  @ArrayMinSize(1, { message: 'El rol debe contener mínimo 1 módulo' })
  @IsArray({ message: 'El módulo del rol debe ser un array' })
  @ValidateIf(
    (modulo) => typeof modulo.menus !== 'object' || modulo.menus.length > 0,
  )
  @IsNotEmpty({ message: 'Por favor, ingrese modulo(s) del rol' })
  modulos: number[];
}
