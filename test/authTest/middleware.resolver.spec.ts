import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from 'src/auth/resolvers/auth.resolver';
import { AuthService } from 'src/auth/services/auth.service';
import { Usuario, RolUsuario } from 'src/users/entities/user.entity';

const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPass',
    rol: RolUsuario.MEDICO,
};

const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
};

describe('AuthResolver', () => {
    let resolver: AuthResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                { provide: AuthService, useValue: mockAuthService },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
    });

    it('should call authService.login and return token and user', async () => {
        const authResponse = {
            access_token: 'mockToken',
            usuario: mockUsuario,
        };

        mockAuthService.login.mockResolvedValue(authResponse);

        const result = await resolver.login({
            email: 'test@example.com',
            password: '123456',
        });

        expect(result).toEqual(authResponse);
        expect(mockAuthService.login).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: '123456',
        });
    });

    it('should call authService.register and return created user', async () => {
        mockAuthService.register.mockResolvedValue(mockUsuario);

        const result = await resolver.register({
            email: 'test@example.com',
            password: '123456',
            rol: RolUsuario.MEDICO,
        });

        expect(result).toEqual(mockUsuario);
        expect(mockAuthService.register).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: '123456',
            rol: RolUsuario.MEDICO,
        });
    });
});
