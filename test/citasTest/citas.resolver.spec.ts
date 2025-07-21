import { Test, TestingModule } from '@nestjs/testing';
import { CitasResolver } from 'src/citas/resolvers/citas.resolver';
import { CitasService } from 'src/citas/services/citas.service';
import { CreateCitaInput } from 'src/citas/dto/create-cita.input';
import { UpdateCitaInput } from 'src/citas/dto/update-cita.input';
import { Cita } from 'src/citas/entities/cita.entity';

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
    }).compile();

    resolver = module.get<CitasResolver>(CitasResolver);
    service = module.get<CitasService>(CitasService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return all citas', async () => {
    const result = [{ id: 1 }] as Cita[];
    mockService.findAll.mockResolvedValue(result);
    expect(await resolver.findAll()).toBe(result);
  });

  it('should return one cita', async () => {
    const cita = { id: 1 } as Cita;
    mockService.findOne.mockResolvedValue(cita);
    expect(await resolver.findOne(1)).toBe(cita);
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
    expect(await resolver.createCita(input)).toBe(mockCita);
  });

  it('should update a cita', async () => {
    const input: UpdateCitaInput = { razon: 'Actualizado' };
    const result = { id: 1, ...input } as Cita;
    mockService.update.mockResolvedValue(result);
    expect(await resolver.updateCita(1, input)).toBe(result);
  });

  it('should remove a cita', async () => {
    const result = { id: 1 } as Cita;
    mockService.remove.mockResolvedValue(result);
    expect(await resolver.removeCita(1)).toBe(result);
  });
});
