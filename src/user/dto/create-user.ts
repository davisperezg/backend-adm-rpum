import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsInt,
} from 'class-validator';
import { IsMatchPassword } from 'src/lib/decorators/match-password.decorator';

export class CreateUserDTO {
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
  nombres: string;

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
  apellidos: string;

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
  dni: string;

  //EMAIL
  @IsEmail({}, { message: 'Correo inválido' })
  @IsString({
    message: 'El correo del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el correo del usuario' })
  email: string;

  //CONTRASENIA
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe contener una mayúscula, números y caracter especial',
  })
  @MaxLength(200, {
    message:
      'La contraseña del usuario debe ser igual o menor a 200 caracteres',
  })
  @MinLength(8, {
    message: 'La contraseña del usuario debe ser igual o mayor a 8 caracteres',
  })
  @IsString({
    message: 'La contraseña del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese la contraseña del usuario' })
  contrasenia: string;

  //CONFIRMAR PASSWORD
  @IsMatchPassword('contrasenia', {
    message:
      'La confirmación de contraseña no coincide con la contraseña ingresada',
  })
  @MaxLength(200, {
    message:
      'La confirmación de contraseña del usuario debe ser igual o menor a 200 caracteres',
  })
  @MinLength(8, {
    message:
      'La confirmación de contraseña del usuario debe ser igual o mayor a 8 caracteres',
  })
  @IsString({
    message:
      'La confirmación de contraseña del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, confirme contraseña' })
  confirmar_contrasenia: string;

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
  @IsString({
    message: 'El telefono móvil del usuario debe contener una cadena de texto',
  })
  @IsNotEmpty({ message: 'Por favor, ingrese el número de telefono móvil' })
  telefono_movil_1: string;

  @IsInt({ message: 'Ingrese un rol válido' })
  @IsNotEmpty({ message: 'Por favor, ingrese el rol del usuario' })
  rol: number;
}
