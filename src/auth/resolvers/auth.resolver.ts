// auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { loginInput } from '../dtos/login.input';
import { registerInput } from '../dtos/register.input';
import { AuthResponse } from '../dtos/authResponse.input';
import { Usuario } from 'src/users/entities/user.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(() => AuthResponse)
    async login(@Args('input') loginInput: loginInput): Promise<AuthResponse> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => Usuario)
    async register(@Args('input') registerInput: registerInput): Promise<Usuario> {
        return this.authService.register(registerInput);
    }
}