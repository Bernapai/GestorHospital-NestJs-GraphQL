// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { loginInput } from '../dtos/login.input';
import { registerInput } from '../dtos/register.input';
import { AuthResponse } from '../dtos/authResponse.input';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginInput: loginInput): Promise<AuthResponse> {
        const { email, password } = loginInput;
        const usuario = await this.usersService.findByEmail(email);
        const isPasswordValid = await bcrypt.compare(password, usuario?.password || '');

        if (!usuario || !isPasswordValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = { sub: usuario.id, name: usuario.email, role: usuario.rol };
        const access_token = this.jwtService.sign(payload);


        const { password: _, ...usuarioSinPassword } = usuario;
        return { access_token, usuario: usuarioSinPassword as Usuario };
    }

    async register(registerInput: registerInput): Promise<Usuario> {
        const { email, password, rol } = registerInput;
        const existingUser = await this.usersService.findByEmail(email);

        if (existingUser) {
            throw new UnauthorizedException('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.usersService.create({
            email,
            password: hashedPassword,
            rol,
        });

        return newUser;
    }
}