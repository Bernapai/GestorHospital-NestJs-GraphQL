import { Test, TestingModule } from '@nestjs/testing';
import { PacientesResolver } from 'src/pacientes/resolver/pacientes.resolver';
import { PacientesService } from 'src/pacientes/services/pacientes.service';
import { Paciente } from 'src/pacientes/entities/paciente.entity';
import { Usuario, RolUsuario } from 'src/users/entities/user.entity';
import { CreatePacienteInput } from 'src/pacientes/dto/create-paciente.input';
import { UpdatePacienteInput } from 'src/pacientes/dto/update-paciente.input';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


describe('PacientesResolver', () => {
  let resolver: PacientesResolver;
  let service: PacientesService;


  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    rol: RolUsuario.MEDICO,
  };

  const mockPaciente: Paciente = {
    id: 1,
    usuario: mockUsuario,
    nombre: 'Juan Perez',
    dni: '12345678',
    fechaNacimiento: new Date('1990-01-01'),
    telefono: '123456789',
  };

  const mockPacientesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };




  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesResolver, {
          provide: PacientesService,
          useValue: mockPacientesService,
        }
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    resolver = module.get<PacientesResolver>(PacientesResolver);
    service = module.get<PacientesService>(PacientesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of pacientes', async () => {
      const pacientes = [mockPaciente];
      mockPacientesService.findAll.mockResolvedValue(pacientes);

      const result = await resolver.findAll();

      expect(result).toEqual(pacientes);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle service error', async () => {
      mockPacientesService.findAll.mockRejectedValue(new Error('DB Error'));

      await expect(resolver.findAll()).rejects.toThrow('DB Error');
    });
  });

  describe('findOne', () => {
    it('should return a paciente by id', async () => {
      mockPacientesService.findOne.mockResolvedValue(mockPaciente);

      const result = await resolver.findOne(1);

      expect(result).toEqual(mockPaciente);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if paciente not found', async () => {
      mockPacientesService.findOne.mockRejectedValue(new NotFoundException('Paciente not found'));

      await expect(resolver.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPaciente', () => {
    it('should create and return a paciente', async () => {
      const createInput: CreatePacienteInput = {
        nombre: 'Maria Lopez',
        usuarioId: 1,
        dni: '87654321',
        fechaNacimiento: new Date('1995-05-05'),
        telefono: '987654321',
      };
      mockPacientesService.create.mockResolvedValue(mockPaciente);

      const result = await resolver.createPaciente(createInput);

      expect(result).toEqual(mockPaciente);
      expect(service.create).toHaveBeenCalledWith(createInput);
    });

    it('should handle creation error', async () => {
      const createInput: CreatePacienteInput = {
        nombre: 'Maria Lopez',
        usuarioId: 1,
        dni: '87654321',
        fechaNacimiento: new Date('1995-05-05'),
        telefono: '987654321',
      };
      mockPacientesService.create.mockRejectedValue(new Error('Creation error'));

      await expect(resolver.createPaciente(createInput)).rejects.toThrow('Creation error');
    });
  });

  describe('updatePaciente', () => {
    it('should update and return a paciente', async () => {
      const updateInput: UpdatePacienteInput = {
        nombre: 'Updated Name',
        dni: '12345678',
        fechaNacimiento: new Date('1990-01-01'),
        telefono: '123456789',
      };
      mockPacientesService.update.mockResolvedValue(mockPaciente);

      const result = await resolver.updatePaciente(1, updateInput);

      expect(result).toEqual(mockPaciente);
      expect(service.update).toHaveBeenCalledWith(1, updateInput);
    });

    it('should handle update error', async () => {
      const updateInput: UpdatePacienteInput = {
        nombre: 'Non-existent',
        dni: '00000000',
        fechaNacimiento: new Date('2000-01-01'),
        telefono: '000000000',
      };
      mockPacientesService.update.mockRejectedValue(new NotFoundException('Paciente not found'));

      await expect(resolver.updatePaciente(1, updateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUsuario', () => {
    it('should remove a paciente by id', async () => {
      mockPacientesService.remove.mockResolvedValue(mockPaciente);

      const result = await resolver.removeUsuario(1);

      expect(result).toEqual(mockPaciente);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle removal error', async () => {
      mockPacientesService.remove.mockRejectedValue(new NotFoundException('Paciente not found'));

      await expect(resolver.removeUsuario(999)).rejects.toThrow(NotFoundException);
    });
  });


});
