import { IsOptional, IsBoolean } from 'class-validator';
export class QueryListModulo {
  @IsBoolean({ message: 'El valor create debe ser false o true' })
  @IsOptional()
  create: boolean;
}
