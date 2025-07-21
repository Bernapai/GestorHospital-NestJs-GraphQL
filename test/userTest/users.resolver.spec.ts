import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from 'src/users/resolvers/users.resolver';
import { UsersService } from 'src/users/services/users.service';
import { Usuario, RolUsuario } from 'src/users/entities/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    rol: RolUsuario.MEDICO,
  };

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return array of usuarios', async () => {
      const usuarios = [mockUsuario];
      mockUsersService.findAll.mockResolvedValue(usuarios);

      const result = await resolver.findAll();

      expect(result).toEqual(usuarios);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      mockUsersService.findAll.mockRejectedValue(new Error('DB Error'));

      await expect(resolver.findAll()).rejects.toThrow('DB Error');
    });
  });

  describe('findOne', () => {
    it('should return usuario by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUsuario);

      const result = await resolver.findOne(1);

      expect(result).toEqual(mockUsuario);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException', async () => {
      mockUsersService.findOne.mockRejectedValue(new NotFoundException('Usuario no encontrado'));

      await expect(resolver.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUsuario', () => {
    it('should create usuario', async () => {
      const input: CreateUserInput = {
        email: 'new@test.com',
        password: 'password123',
        rol: RolUsuario.PACIENTE
      };
      mockUsersService.create.mockResolvedValue(mockUsuario);

      const result = await resolver.createUsuario(input);

      expect(result).toEqual(mockUsuario);
      expect(service.create).toHaveBeenCalledWith(input);
    });

    it('should handle creation error', async () => {
      const input: CreateUserInput = {
        email: 'test@test.com',
        password: 'pass',
        rol: RolUsuario.MEDICO
      };
      mockUsersService.create.mockRejectedValue(new Error('Email already exists'));

      await expect(resolver.createUsuario(input)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUsuario', () => {
    it('should update usuario', async () => {
      const input: UpdateUserInput = {
        email: 'updated@test.com'
      };
      const updatedUsuario = { ...mockUsuario, email: 'updated@test.com' };
      mockUsersService.update.mockResolvedValue(updatedUsuario);

      const result = await resolver.updateUsuario(1, input);

      expect(result).toEqual(updatedUsuario);
      expect(service.update).toHaveBeenCalledWith(1, input);
    });

    it('should throw error when usuario not found', async () => {
      const input: UpdateUserInput = { email: 'test@test.com' };
      mockUsersService.update.mockRejectedValue(new NotFoundException('Usuario no encontrado'));

      await expect(resolver.updateUsuario(999, input)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUsuario', () => {
    it('should remove usuario', async () => {
      mockUsersService.remove.mockResolvedValue(mockUsuario);

      const result = await resolver.removeUsuario(1);

      expect(result).toEqual(mockUsuario);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw error when usuario not found', async () => {
      mockUsersService.remove.mockRejectedValue(new NotFoundException('Usuario no encontrado'));

      await expect(resolver.removeUsuario(999)).rejects.toThrow(NotFoundException);
    });
  });
});