// dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { RolUsuario } from 'src/users/entities/user.entity';

@InputType({ description: 'Datos para registrar un nuevo usuario en el sistema' })
export class registerInput {
    @Field({ description: 'Correo electrónico válido para el nuevo usuario' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    @Field({ description: 'Contraseña con mínimo 6 caracteres' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @Field(() => RolUsuario, { description: 'Rol asignado al usuario: MEDICO o PACIENTE' })
    @IsEnum(RolUsuario, { message: 'El rol debe ser MEDICO o PACIENTE' })
    rol: RolUsuario;
}
