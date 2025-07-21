import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/services/users.service';
import { Usuario, RolUsuario } from 'src/users/entities/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { UpdateUserInput } from 'src/users/dto/update-user.input';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';


describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Usuario>;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    rol: RolUsuario.MEDICO,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save usuario', async () => {
      const input: CreateUserInput = {
        email: 'new@test.com',
        password: 'password123',
        rol: RolUsuario.PACIENTE
      };
      mockRepository.create.mockReturnValue(mockUsuario);
      mockRepository.save.mockResolvedValue(mockUsuario);

      const result = await service.create(input);

      expect(result).toEqual(mockUsuario);
      expect(repository.create).toHaveBeenCalledWith(input);
      expect(repository.save).toHaveBeenCalledWith(mockUsuario);
    });

    it('should handle save error', async () => {
      const input: CreateUserInput = {
        email: 'test@test.com',
        password: 'pass',
        rol: RolUsuario.MEDICO
      };
      mockRepository.create.mockReturnValue(mockUsuario);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(input)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return array of usuarios', async () => {
      const usuarios = [mockUsuario];
      mockRepository.find.mockResolvedValue(usuarios);

      const result = await service.findAll();

      expect(result).toEqual(usuarios);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should handle repository error', async () => {
      mockRepository.find.mockRejectedValue(new Error('DB connection failed'));

      await expect(service.findAll()).rejects.toThrow('DB connection failed');
    });
  });

  describe('findOne', () => {
    it('should return usuario by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUsuario);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUsuario);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when usuario not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Usuario con id 999 no encontrado');
    });
  });

  describe('findByEmail', () => {
    it('should return usuario by email', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUsuario);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUsuario);
      expect(repository.findOneBy).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw NotFoundException when email not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findByEmail('notfound@test.com')).rejects.toThrow(NotFoundException);
      await expect(service.findByEmail('notfound@test.com')).rejects.toThrow('Usuario con id notfound@test.com no encontrado');
    });
  });

  describe('update', () => {
    it('should update and return usuario', async () => {
      const input: UpdateUserInput = {
        email: 'updated@test.com'
      };
      const updatedUsuario = { ...mockUsuario, email: 'updated@test.com' };
      mockRepository.preload.mockResolvedValue(updatedUsuario);
      mockRepository.save.mockResolvedValue(updatedUsuario);

      const result = await service.update(1, input);

      expect(result).toEqual(updatedUsuario);
      expect(repository.preload).toHaveBeenCalledWith({ id: 1, ...input });
      expect(repository.save).toHaveBeenCalledWith(updatedUsuario);
    });

    it('should throw NotFoundException when usuario not found', async () => {
      const input: UpdateUserInput = { email: 'test@test.com' };
      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, input)).rejects.toThrow(NotFoundException);
      await expect(service.update(999, input)).rejects.toThrow('Usuario con id 999 no encontrado');
    });
  });

  describe('remove', () => {
    it('should remove and return usuario', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockUsuario);
      mockRepository.remove.mockResolvedValue(mockUsuario);

      const result = await service.remove(1);

      expect(result).toEqual(mockUsuario);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.remove).toHaveBeenCalledWith(mockUsuario);
    });

    it('should throw NotFoundException when usuario not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Usuario con id 999 no encontrado');
    });
  });
});