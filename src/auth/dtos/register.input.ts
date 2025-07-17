// dto/register.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty, MinLength, IsEnum } from 'class-validator';
import { RolUsuario } from 'src/users/entities/user.entity';

@InputType()
export class registerInput {
    @Field()
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @Field(() => RolUsuario)
    @IsEnum(RolUsuario, { message: 'El rol debe ser MEDICO o PACIENTE' })
    rol: RolUsuario;
}