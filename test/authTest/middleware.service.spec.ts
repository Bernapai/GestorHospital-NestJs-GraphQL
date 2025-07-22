import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RolUsuario, Usuario } from 'src/users/entities/user.entity';

const mockUser: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    rol: RolUsuario.MEDICO,
};

describe('AuthService', () => {
    let service: AuthService;
    let usersService: any;
    let jwtService: any;

    beforeEach(async () => {
        usersService = {
            findByEmail: jest.fn(),
            create: jest.fn(),
        };

        jwtService = {
            sign: jest.fn().mockReturnValue('mockToken'),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: usersService },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('login', () => {
        it('should return access_token and user if credentials are valid', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

            const result = await service.login({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result).toEqual({ access_token: 'mockToken', usuario: mockUser });
        });

        it('should throw UnauthorizedException if credentials are invalid', async () => {
            usersService.findByEmail.mockResolvedValue(null);

            await expect(
                service.login({ email: 'fake@example.com', password: 'wrongpass' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('register', () => {
        it('should throw if user already exists', async () => {
            usersService.findByEmail.mockResolvedValue(mockUser);

            await expect(
                service.register({
                    email: 'test@example.com',
                    password: 'secret123',
                    rol: RolUsuario.MEDICO,
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should return new user if registration is successful', async () => {
            usersService.findByEmail.mockResolvedValue(null);
            usersService.create.mockResolvedValue(mockUser);
            jest.spyOn(require('bcrypt'), 'hash').mockResolvedValue('hashedPassword');

            const result = await service.register({
                email: 'test@example.com',
                password: 'secret123',
                rol: RolUsuario.MEDICO,
            });

            expect(result).toEqual(mockUser);
        });
    });
});
