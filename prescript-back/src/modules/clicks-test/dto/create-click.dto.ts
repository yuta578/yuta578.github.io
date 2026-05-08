import { IsOptional } from 'class-validator';

// El body del POST está vacío, pero dejamos el DTO
// preparado por si en el futuro se añaden campos.
export class CreateClickDto {
  @IsOptional()
  dummy?: never;
}
