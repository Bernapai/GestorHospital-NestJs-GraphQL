import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';
import { Paciente } from '../entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PacientesService {
  private readonly logger = new Logger(PacientesService.name);

  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createPacienteInput: CreatePacienteInput): Promise<Paciente> {
    this.logger.log(`Creating paciente: ${createPacienteInput.nombre || 'N/A'}`);

    try {
      const paciente = this.pacienteRepository.create(createPacienteInput);
      const result = await this.pacienteRepository.save(paciente);

      // Limpiar cache
      await this.cacheManager.del('pacientes:all');

      this.logger.log(`Paciente created: ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating paciente: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Paciente[]> {
    // Intentar del cache primero
    const cached = await this.cacheManager.get<Paciente[]>('pacientes:all');
    if (cached) {
      this.logger.log('Pacientes fetched from cache');
      return cached;
    }

    // No está en cache, buscar en DB
    this.logger.log('Fetching pacientes from database');
    const pacientes = await this.pacienteRepository.find({
      relations: ['usuario'] // Agregar relaciones si las tienes
    });

    // Guardar en cache por 5 minutos
    await this.cacheManager.set('pacientes:all', pacientes, 300);

    return pacientes;
  }

  async findOne(id: number): Promise<Paciente> {
    const cacheKey = `paciente:${id}`;

    // Buscar en cache
    const cached = await this.cacheManager.get<Paciente>(cacheKey);
    if (cached) {
      this.logger.log(`Paciente ${id} fetched from cache`);
      return cached;
    }

    // Buscar en DB
    this.logger.log(`Fetching paciente ${id} from database`);
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['usuario'] // Agregar relaciones si las tienes
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Guardar en cache por 10 minutos
    await this.cacheManager.set(cacheKey, paciente, 600);

    return paciente;
  }

  async update(id: number, updatePacienteInput: UpdatePacienteInput): Promise<Paciente> {
    this.logger.log(`Updating paciente: ${id}`);

    try {
      const paciente = await this.findOne(id); // Verifica que existe (usa cache)
      Object.assign(paciente, updatePacienteInput);
      const result = await this.pacienteRepository.save(paciente);

      // Limpiar cache relacionado
      await this.cacheManager.del(`paciente:${id}`);
      await this.cacheManager.del('pacientes:all');

      this.logger.log(`Paciente updated: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating paciente ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<Paciente> {
    this.logger.log(`Removing paciente: ${id}`);

    try {
      const result = await this.pacienteRepository.findOneBy({ id });

      if (!result) {
        throw new NotFoundException(`Paciente con id ${id} no encontrado`);
      }

      await this.pacienteRepository.remove(result);

      // Limpiar cache
      await this.cacheManager.del(`paciente:${id}`);
      await this.cacheManager.del('pacientes:all');

      this.logger.log(`Paciente removed: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error removing paciente ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}