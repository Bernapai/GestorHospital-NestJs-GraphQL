import { Test, TestingModule } from '@nestjs/testing';
import { CitasService } from 'src/citas/services/citas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cita } from 'src/citas/entities/cita.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCitaInput } from 'src/citas/dto/create-cita.input';
import { UpdateCitaInput } from 'src/citas/dto/update-cita.input';

describe('CitasService', () => {
  let service: CitasService;
  let repo: Repository<Cita>;

  const mockCita: Cita = {
    id: 1,
    medico: { id: 1 } as any, // Mocked Medico entity
    paciente: { id: 2 } as any, // Mocked Paciente entity
    razon: 'Consulta',
    fecha: new Date('2025-07-21'),
    hora: '10:00',
  };

  const mockCitaRepository = {
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
        CitasService,
        {
          provide: getRepositoryToken(Cita),
          useValue: mockCitaRepository,
        },
      ],
    }).compile();

    service = module.get<CitasService>(CitasService);
    repo = module.get<Repository<Cita>>(getRepositoryToken(Cita));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a cita', async () => {
      const input: CreateCitaInput = {
        medicoId: 1,
        pacienteId: 2,
        razon: 'Chequeo',
        fecha: new Date('2025-07-21'),
        hora: '10:00',
      };

      mockCitaRepository.create.mockReturnValue(mockCita);
      mockCitaRepository.save.mockResolvedValue(mockCita);

      const result = await service.create(input);
      expect(result).toEqual(mockCita);
      expect(mockCitaRepository.create).toHaveBeenCalledWith(input);
      expect(mockCitaRepository.save).toHaveBeenCalledWith(mockCita);
    });
  });

  describe('findAll', () => {
    it('should return all citas', async () => {
      const citas = [{ id: 1 }, { id: 2 }] as Cita[];
      mockCitaRepository.find.mockResolvedValue(citas);
      const result = await service.findAll();
      expect(result).toEqual(citas);
    });
  });

  describe('findOne', () => {
    it('should return a cita by ID', async () => {
      const cita = { id: 1 } as Cita;
      mockCitaRepository.findOne.mockResolvedValue(cita);
      const result = await service.findOne(1);
      expect(result).toEqual(cita);
    });

    it('should throw NotFoundException if cita not found', async () => {
      mockCitaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a cita', async () => {
      const existing = { id: 1, razon: 'Antigua' } as Cita;
      const input: UpdateCitaInput = { razon: 'Nueva' };
      const updated = { ...existing, ...input };

      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      mockCitaRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, input);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove and return the cita', async () => {
      const cita = { id: 1 } as Cita;
      mockCitaRepository.findOneBy.mockResolvedValue(cita);
      mockCitaRepository.remove.mockResolvedValue(cita);
      const result = await service.remove(1);
      expect(result).toEqual(cita);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCitaRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
