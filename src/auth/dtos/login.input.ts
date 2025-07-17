// dto/login.input.ts
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class loginInput {
    @Field()
    @IsEmail({}, { message: 'Debe ser un email válido' })
    email: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    password: string;
}