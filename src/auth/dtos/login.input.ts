// dto/login.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType({ description: 'Datos para iniciar sesión en el sistema' })
export class loginInput {
    @Field({ description: 'Correo electrónico registrado del usuario' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    @Field({ description: 'Contraseña asociada al usuario' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}
