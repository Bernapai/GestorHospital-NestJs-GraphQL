// medicos.resolver.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MedicosResolver } from 'src/medicos/resolver/medicos.resolver';
import { MedicosService } from 'src/medicos/services/medicos.service';
import { Medico } from 'src/medicos/entities/medico.entity';
import { CreateMedicoInput } from 'src/medicos/dto/create-medico.input';
import { UpdateMedicoInput } from 'src/medicos/dto/update-medico.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';

describe('MedicosResolver', () => {
  let resolver: MedicosResolver;
  let service: MedicosService;

  const mockMedico: Medico = {
    id: 1,
    nombre: 'Dr. Juan',
    direccion: 'Calle Falsa 123',
    especialidad: 'Cardiología',
    telefono: '123456789',
    usuario: { id: 1 } as any,
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicosResolver,
        { provide: MedicosService, useValue: mockService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    resolver = module.get<MedicosResolver>(MedicosResolver);
    service = module.get<MedicosService>(MedicosService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('debería retornar todos los médicos', async () => {
      mockService.findAll.mockResolvedValue([mockMedico]);

      const result = await resolver.findAll();

      expect(result).toEqual([mockMedico]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un médico por id', async () => {
      mockService.findOne.mockResolvedValue(mockMedico);

      const result = await resolver.findOne(1);

      expect(result).toEqual(mockMedico);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(resolver.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMedico', () => {
    it('debería crear un médico', async () => {
      const input: CreateMedicoInput = {
        nombre: 'Dr. Nuevo',
        direccion: 'Nueva Dirección',
        especialidad: 'Dermatología',
        telefono: '111222333',
        usuarioId: 1,
      };

      mockService.create.mockResolvedValue(mockMedico);

      const result = await resolver.createMedico(input);

      expect(result).toEqual(mockMedico);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateMedico', () => {
    it('debería actualizar un médico', async () => {
      const input: UpdateMedicoInput = {
        nombre: 'Dr. Modificado',
      };

      const updated = { ...mockMedico, ...input };

      mockService.update.mockResolvedValue(updated);

      const result = await resolver.updateMedico(1, input);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, input);
    });
  });

  describe('removeMedico', () => {
    it('debería eliminar un médico', async () => {
      mockService.remove.mockResolvedValue(mockMedico);

      const result = await resolver.removeMedico(1);

      expect(result).toEqual(mockMedico);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException());

      await expect(resolver.removeMedico(999)).rejects.toThrow(NotFoundException);
    });
  });
});
