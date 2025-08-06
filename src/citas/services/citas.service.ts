import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';
import { Cita } from '../entities/cita.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Medico } from 'src/medicos/entities/medico.entity';

@Injectable()
export class CitasService {
  private readonly logger = new Logger(CitasService.name);

  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createCitaInput: CreateCitaInput): Promise<Cita> {
    this.logger.log(`Creating cita for fecha: ${createCitaInput.fecha || 'N/A'}`);

    try {
      const cita = this.citaRepository.create(createCitaInput);
      const result = await this.citaRepository.save(cita);

      // Limpiar cache relacionado
      await this.cacheManager.del('citas:all');
      await this.cacheManager.del(`citas:medico:${createCitaInput.medicoId}`);
      await this.cacheManager.del(`citas:paciente:${createCitaInput.pacienteId}`);

      this.logger.log(`Cita created: ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating cita: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Cita[]> {
    // Intentar del cache primero
    const cached = await this.cacheManager.get<Cita[]>('citas:all');
    if (cached) {
      this.logger.log('Citas fetched from cache');
      return cached;
    }

    // No está en cache, buscar en DB
    this.logger.log('Fetching citas from database');
    const citas = await this.citaRepository.find({
      relations: ['medico', 'paciente'] // Agregar tus relaciones reales
    });

    // Guardar en cache por 3 minutos (las citas cambian frecuentemente)
    await this.cacheManager.set('citas:all', citas, 180);

    return citas;
  }

  async findOne(id: number): Promise<Cita> {
    const cacheKey = `cita:${id}`;

    // Buscar en cache
    const cached = await this.cacheManager.get<Cita>(cacheKey);
    if (cached) {
      this.logger.log(`Cita ${id} fetched from cache`);
      return cached;
    }

    // Buscar en DB
    this.logger.log(`Fetching cita ${id} from database`);
    const cita = await this.citaRepository.findOne({
      where: { id },
      relations: ['medico', 'paciente'] // Agregar tus relaciones reales
    });

    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrado`);
    }

    // Guardar en cache por 5 minutos
    await this.cacheManager.set(cacheKey, cita, 300);

    return cita;
  }

  async update(id: number, updateCitaInput: UpdateCitaInput): Promise<Cita> {
    this.logger.log(`Updating cita: ${id}`);

    try {
      const cita = await this.findOne(id); // Verifica que existe (usa cache)
      Object.assign(cita, updateCitaInput);
      const result = await this.citaRepository.save(cita);

      // Limpiar cache relacionado
      await this.cacheManager.del(`cita:${id}`);
      await this.cacheManager.del('citas:all');
      // Si tienes relaciones, limpiar también:
      // await this.cacheManager.del(`citas:medico:${result.medicoId}`);
      // await this.cacheManager.del(`citas:paciente:${result.pacienteId}`);

      this.logger.log(`Cita updated: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating cita ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<Cita> {
    this.logger.log(`Removing cita: ${id}`);

    try {
      const result = await this.citaRepository.findOneBy({ id });

      if (!result) {
        throw new NotFoundException(`Cita con id ${id} no encontrado`); // Corregido: era "Paciente"
      }

      await this.citaRepository.remove(result);

      // Limpiar cache
      await this.cacheManager.del(`cita:${id}`);
      await this.cacheManager.del('citas:all');

      this.logger.log(`Cita removed: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error removing cita ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Métodos adicionales útiles para citas:

  // Buscar citas por médico
  async findByMedico(medicoId: number): Promise<Cita[]> {
    const cacheKey = `citas:medico:${medicoId}`;

    const cached = await this.cacheManager.get<Cita[]>(cacheKey);
    if (cached) {
      this.logger.log(`Citas by medico ${medicoId} fetched from cache`);
      return cached;
    }

    this.logger.log(`Fetching citas by medico ${medicoId} from database`);
    const citas = await this.citaRepository.find({
      where: { medico: { id: medicoId } },
      relations: ['medico', 'paciente']
    });

    await this.cacheManager.set(cacheKey, citas, 240); // 4 minutos
    return citas;
  }

  // Buscar citas por paciente
  async findByPaciente(pacienteId: number): Promise<Cita[]> {
    const cacheKey = `citas:paciente:${pacienteId}`;

    const cached = await this.cacheManager.get<Cita[]>(cacheKey);
    if (cached) {
      this.logger.log(`Citas by paciente ${pacienteId} fetched from cache`);
      return cached;
    }

    this.logger.log(`Fetching citas by paciente ${pacienteId} from database`);
    const citas = await this.citaRepository.find({
      where: { paciente: { id: pacienteId } }, // Ajustar según tu entidad
      relations: ['medico', 'paciente']
    });

    await this.cacheManager.set(cacheKey, citas, 240); // 4 minutos
    return citas;
  }

  // Buscar citas por fecha
  async findByFecha(fecha: Date): Promise<Cita[]> {
    const cacheKey = `citas:fecha:${fecha.toISOString().split('T')[0]}`;

    const cached = await this.cacheManager.get<Cita[]>(cacheKey);
    if (cached) {
      this.logger.log(`Citas by fecha ${fecha.toISOString().split('T')[0]} fetched from cache`);
      return cached;
    }

    this.logger.log(`Fetching citas by fecha ${fecha.toISOString().split('T')[0]} from database`);
    const citas = await this.citaRepository.find({
      where: { fecha }, // Ajustar según tu entidad
      relations: ['medico', 'paciente']
    });

    await this.cacheManager.set(cacheKey, citas, 300); // 5 minutos
    return citas;
  }
}