// dto/create-usuario.dto.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RolUsuario } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => RolUsuario)
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}
