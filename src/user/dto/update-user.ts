import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';

export class UpdateUserDTO {
  //NOMBRE
  @Matches(/^[A-Za-zÑñ\s]+$/, {
    message: 'El nombre del usuario solo puede contener letras',
  })
  @MaxLength(100, {
    message: 'El nombre del usuario debe ser igual o menor a 100 caracteres',
  })
  @MinLength(3, {
    message: 'El nombre del usuario debe ser igual o mayor a 3 caracteres',
  })
  @IsString({
    message: 'El nombre del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese los nombres del usuario' })
  @IsOptional()
  nombres?: string;

  //APELLIDOS
  @Matches(/^[A-Za-zÑñ\s]+$/, {
    message: 'El apellido del usuario solo puede contener letras',
  })
  @MaxLength(100, {
    message: 'El apellido del usuario debe ser igual o menor a 100 caracteres',
  })
  @MinLength(3, {
    message: 'El apellido del usuario debe ser igual o mayor a 3 caracteres',
  })
  @IsString({
    message: 'El apellido del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese los apellidos del usuario' })
  @IsOptional()
  apellidos?: string;

  //DNI
  @Matches(/^[0-9\s]+$/, {
    message: 'El dni del usuario solo puede contener números',
  })
  @MaxLength(8, {
    message: 'El dni del usuario debe ser igual a 8 caracteres',
  })
  @MinLength(8, {
    message: 'El dni del usuario debe ser igual a 8 caracteres',
  })
  @IsString({
    message: 'El dni del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el dni del usuario' })
  @IsOptional()
  dni?: string;

  //EMAIL
  @IsEmail({}, { message: 'Correo inválido' })
  @IsString({
    message: 'El correo del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el correo del usuario' })
  @IsOptional()
  email?: string;

  //TELEFONO_MOVIL_1
  @Matches(/^(9[0-9]{8})+$/, {
    message: 'Ingrese un telefono móvil válido',
  })
  @MaxLength(9, {
    message: 'El telefono móvil del usuario debe ser igual a 9 caracteres',
  })
  @MinLength(9, {
    message: 'El telefono móvil del usuario debe ser igual a 9 caracteres',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el número de telefono móvil' })
  @IsString({
    message: 'El telefono móvil del usuario debe contener una cadena de texto',
  })
  @IsOptional()
  telefono_movil_1?: string;

  //TELEFONO_MOVIL_2
  @Matches(/^(9[0-9]{8})+$/, {
    message: 'Ingrese un telefono móvil válido',
  })
  @MaxLength(9, {
    message: 'El telefono móvil 2 del usuario debe ser igual a 9 caracteres',
  })
  @MinLength(9, {
    message: 'El telefono móvil 2 del usuario debe ser igual a 9 caracteres',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el número de telefono móvil 2' })
  @IsString({
    message:
      'El telefono móvil 2 del usuario debe contener una cadena de texto',
  })
  @IsOptional()
  telefono_movil_2?: string;

  @IsDate({ message: 'La fecha de nacimiento debe contener una fecha válida' })
  @IsOptional()
  fecha_nacimiento?: Date;

  @IsString({
    message: 'La foto debe contener una cadena de texto',
  })
  @IsOptional()
  foto?: string;

  @IsInt({ message: 'Ingrese un rol válido' })
  @IsOptional()
  rol?: number;
}
