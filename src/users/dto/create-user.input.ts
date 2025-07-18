// create-user.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../entities/user.entity';

@InputType({ description: 'Datos para crear un nuevo usuario' })
export class CreateUserInput {
  @Field({ description: 'Correo electrónico válido del usuario' })
  @IsEmail()
  email: string;

  @Field({ description: 'Contraseña con al menos 6 caracteres' })
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => RolUsuario, { description: 'Rol del usuario: médico o paciente' })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
