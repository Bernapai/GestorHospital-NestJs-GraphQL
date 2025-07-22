import { Test, TestingModule } from '@nestjs/testing';
import { CitasResolver } from 'src/citas/resolvers/citas.resolver';
import { CitasService } from 'src/citas/services/citas.service';
import { CreateCitaInput } from 'src/citas/dto/create-cita.input';
import { UpdateCitaInput } from 'src/citas/dto/update-cita.input';
import { Cita } from 'src/citas/entities/cita.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundException } from '@nestjs/common';

describe('CitasResolver', () => {
  let resolver: CitasResolver;
  let service: CitasService;

  const mockCita: Cita = {
    id: 1,
    medico: { id: 1 } as any, // Mocked Medico entity
    paciente: { id: 2 } as any, // Mocked Paciente entity
    razon: 'Consulta',
    fecha: new Date('2025-07-21'),
    hora: '10:00',
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
        CitasResolver,
        {
          provide: CitasService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    resolver = module.get<CitasResolver>(CitasResolver);
    service = module.get<CitasService>(CitasService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return all citas', async () => {
    mockService.findAll.mockResolvedValue([mockCita]);

    const result = await resolver.findAll();

    expect(result).toEqual([mockCita]);
    expect(service.findAll).toHaveBeenCalled();
  });

  describe('findOne', () => {
    it('debería retornar una cita por id', async () => {
      mockService.findOne.mockResolvedValue(mockCita);

      const result = await resolver.findOne(1);

      expect(result).toEqual(mockCita);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(resolver.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });


  it('should create a cita', async () => {
    const input: CreateCitaInput = {
      medicoId: 1,
      pacienteId: 2,
      razon: 'Consulta',
      fecha: new Date('2025-07-21'),
      hora: '15:00',
    };
    mockService.create.mockResolvedValue(mockCita);
    const result = await resolver.createCita(input);

    expect(result).toEqual(mockCita);
    expect(service.create).toHaveBeenCalledWith(input);
  });



  describe('updateCita', () => {
    it('debería actualizar una cita', async () => {
      const input: UpdateCitaInput = {
        razon: 'Consulta de seguimiento',
      };

      const updated = { ...mockCita, ...input };

      mockService.update.mockResolvedValue(updated);

      const result = await resolver.updateCita(1, input);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, input);
    });
  });

  describe('removeCita', () => {
    it('debería eliminar una cita', async () => {
      mockService.remove.mockResolvedValue(mockCita);

      const result = await resolver.removeCita(1);

      expect(result).toEqual(mockCita);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('debería lanzar NotFoundException si no existe', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException());

      await expect(resolver.removeCita(999)).rejects.toThrow(NotFoundException);
    });
  });
});
