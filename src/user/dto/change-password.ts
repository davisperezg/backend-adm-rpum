import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsMatchPassword } from 'src/lib/decorators/match-password.decorator';
export class ChangePasswordDTO {
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
}
