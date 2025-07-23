// dto/auth.response.ts
import { ObjectType, Field } from '@nestjs/graphql';
import { registerInput } from './register.input';

@ObjectType()
export class AuthResponse {
    @Field()
    access_token: string;

    @Field(() => registerInput)
    usuario: registerInput;
}