// dto/auth.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { Usuario } from 'src/users/entities/user.entity';
@ObjectType()
export class AuthResponse {
    @Field()
    access_token: string;

    @Field(() => Usuario) // Cambiado: Usuario es un ObjectType válido
    usuario: Usuario;

}