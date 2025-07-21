import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from 'src/pacientes/services/pacientes.service';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Usuario, RolUsuario } from 'src/users/entities/user.entity';
import { CreatePacienteInput } from 'src/pacientes/dto/create-paciente.input';
import { UpdatePacienteInput } from 'src/pacientes/dto/update-paciente.input';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


describe('PacientesService', () => {
  let service: PacientesService;
  let repository: Repository<Paciente>;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    rol: RolUsuario.PACIENTE,
  };

  const mockPaciente: Paciente = {
    id: 1,
    usuario: mockUsuario, // Assuming mockUsuario is defined elsewhere
    nombre: 'Juan Perez',
    dni: '12345678',
    fechaNacimiento: new Date('1990-01-01'),
    telefono: '123456789',
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
        PacientesService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
    repository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaciente', () => {
    it('should create and save paciente', async () => {
      const input: CreatePacienteInput = {
        nombre: 'Nuevo Paciente',
        usuarioId: 1,
        dni: '87654321',
        fechaNacimiento: new Date('1995-05-05'),
        telefono: '987654321',
      };
      mockRepository.create.mockReturnValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      const result = await service.create(input);
      expect(result).toEqual(mockPaciente);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPaciente);
    });
  });


  describe('findAll', () => {
    it('should return an array of pacientes', async () => {
      const pacientes = [mockPaciente];
      mockRepository.find.mockResolvedValue(pacientes);

      const result = await service.findAll();
      expect(result).toEqual(pacientes);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });


  describe('findOne', () => {
    it('should return a paciente by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPaciente);

      const result = await service.findOne(1);
      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if paciente not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });


  describe('updatePaciente', () => {
    const updateInput: UpdatePacienteInput = {
      nombre: 'Updated Paciente',
      dni: '12345678',
      fechaNacimiento: new Date('1990-01-01'),
      telefono: '123456789',
    };

    it('should update and return a paciente', async () => {
      mockRepository.preload.mockResolvedValue(mockPaciente);
      mockRepository.save.mockResolvedValue(mockPaciente);

      const result = await service.update(1, updateInput);
      expect(result).toEqual(mockPaciente);
      expect(mockRepository.preload).toHaveBeenCalledWith(updateInput);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPaciente);
    });

    it('should throw NotFoundException if paciente to update does not exist', async () => {
      mockRepository.preload.mockResolvedValue(null);

      await expect(service.update(1, updateInput)).rejects.toThrow(NotFoundException);
    });
  });



  describe('removePaciente', () => {
    it('should remove a paciente', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockPaciente);
      mockRepository.remove.mockResolvedValue(mockPaciente);

      const result = await service.remove(1);
      expect(result).toEqual(mockPaciente);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockPaciente);
    });

    it('should throw NotFoundException if paciente to remove does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

});
