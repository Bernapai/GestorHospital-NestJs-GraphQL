import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';
import { Medico } from '../entities/medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MedicosService {
  private readonly logger = new Logger(MedicosService.name);

  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createMedicoInput: CreateMedicoInput): Promise<Medico> {
    this.logger.log(`Creating medico: ${createMedicoInput.nombre || 'N/A'}`);

    try {
      const medico = this.medicoRepository.create(createMedicoInput);
      const result = await this.medicoRepository.save(medico);

      // Limpiar cache
      await this.cacheManager.del('medicos:all');

      this.logger.log(`Medico created: ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating medico: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Medico[]> {
    // Intentar del cache primero
    const cached = await this.cacheManager.get<Medico[]>('medicos:all');
    if (cached) {
      this.logger.log('Medicos fetched from cache');
      return cached;
    }

    // No está en cache, buscar en DB
    this.logger.log('Fetching medicos from database');
    const medicos = await this.medicoRepository.find({
      relations: ['usuario'] // Solo la relación que existe
    });

    // Guardar en cache por 5 minutos
    await this.cacheManager.set('medicos:all', medicos, 300);

    return medicos;
  }

  async findOne(id: number): Promise<Medico> {
    const cacheKey = `medico:${id}`;

    // Buscar en cache
    const cached = await this.cacheManager.get<Medico>(cacheKey);
    if (cached) {
      this.logger.log(`Medico ${id} fetched from cache`);
      return cached;
    }

    // Buscar en DB
    this.logger.log(`Fetching medico ${id} from database`);
    const medico = await this.medicoRepository.findOne({
      where: { id },
      relations: ['usuario'] // Solo la relación que existe
    });

    if (!medico) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }

    // Guardar en cache por 10 minutos
    await this.cacheManager.set(cacheKey, medico, 600);

    return medico;
  }

  async update(id: number, updateMedicoInput: UpdateMedicoInput): Promise<Medico> {
    this.logger.log(`Updating medico: ${id}`);

    try {
      const medico = await this.findOne(id); // Verifica que existe (usa cache)
      Object.assign(medico, updateMedicoInput);
      const result = await this.medicoRepository.save(medico);

      // Limpiar cache relacionado
      await this.cacheManager.del(`medico:${id}`);
      await this.cacheManager.del('medicos:all');

      this.logger.log(`Medico updated: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating medico ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<Medico> {
    this.logger.log(`Removing medico: ${id}`);

    try {
      const result = await this.medicoRepository.findOneBy({ id });

      if (!result) {
        throw new NotFoundException(`Medico con id ${id} no encontrado`);
      }

      await this.medicoRepository.remove(result);

      // Limpiar cache
      await this.cacheManager.del(`medico:${id}`);
      await this.cacheManager.del('medicos:all');

      this.logger.log(`Medico removed: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error removing medico ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Método adicional: buscar médicos por especialidad (con cache)
  async findByEspecialidad(especialidad: string): Promise<Medico[]> {
    const cacheKey = `medicos:especialidad:${especialidad}`;

    // Buscar en cache
    const cached = await this.cacheManager.get<Medico[]>(cacheKey);
    if (cached) {
      this.logger.log(`Medicos by especialidad ${especialidad} fetched from cache`);
      return cached;
    }

    // Buscar en DB
    this.logger.log(`Fetching medicos by especialidad ${especialidad} from database`);
    const medicos = await this.medicoRepository.find({
      where: { especialidad }, // Buscar por string de especialidad
      relations: ['usuario']
    });

    // Guardar en cache por 8 minutos
    await this.cacheManager.set(cacheKey, medicos, 480);

    return medicos;
  }
}