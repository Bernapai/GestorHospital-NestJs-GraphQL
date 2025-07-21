// medicos.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MedicosService } from 'src/medicos/services/medicos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateMedicoInput } from 'src/medicos/dto/create-medico.input';
import { UpdateMedicoInput } from 'src/medicos/dto/update-medico.input';

describe('MedicosService', () => {
  let service: MedicosService;
  let repository: Repository<Medico>;

  const mockMedico: Medico = {
    id: 1,
    nombre: 'Dr. Juan',
    direccion: 'Calle Falsa 123',
    especialidad: 'Cardiología',
    telefono: '123456789',
    usuario: { id: 1 } as any, // simulación simple
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicosService,
        {
          provide: getRepositoryToken(Medico),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MedicosService>(MedicosService);
    repository = module.get<Repository<Medico>>(getRepositoryToken(Medico));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('debería crear y guardar un médico', async () => {
      const input: CreateMedicoInput = {
        nombre: 'Dr. Juan',
        direccion: 'Calle Falsa 123',
        especialidad: 'Cardiología',
        telefono: '123456789',
        usuarioId: 1,
      };
      mockRepository.create.mockReturnValue(mockMedico);
      mockRepository.save.mockResolvedValue(mockMedico);

      const result = await service.create(input);

      expect(result).toEqual(mockMedico);
      expect(repository.create).toHaveBeenCalledWith(input);
      expect(repository.save).toHaveBeenCalledWith(mockMedico);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los médicos', async () => {
      mockRepository.find.mockResolvedValue([mockMedico]);

      const result = await service.findAll();

      expect(result).toEqual([mockMedico]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un médico por id', async () => {
      mockRepository.findOne.mockResolvedValue(mockMedico);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMedico);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('debería actualizar un médico existente', async () => {
      const updateInput: UpdateMedicoInput = {
        nombre: 'Dr. Actualizado',
      };

      const updatedMedico = { ...mockMedico, ...updateInput };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockMedico);
      mockRepository.save.mockResolvedValue(updatedMedico);

      const result = await service.update(1, updateInput);

      expect(result).toEqual(updatedMedico);
      expect(repository.save).toHaveBeenCalledWith(updatedMedico);
    });
  });

  describe('remove', () => {
    it('debería eliminar un médico existente', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockMedico);
      mockRepository.remove.mockResolvedValue(mockMedico);

      const result = await service.remove(1);

      expect(result).toEqual(mockMedico);
      expect(repository.remove).toHaveBeenCalledWith(mockMedico);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
