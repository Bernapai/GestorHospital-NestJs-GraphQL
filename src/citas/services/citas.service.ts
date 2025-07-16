import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';
import { Cita } from '../entities/cita.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepository: Repository<Cita>,
  ) { }

  async create(createCitaInput: CreateCitaInput): Promise<Cita> {
    const cita = this.citaRepository.create(createCitaInput);
    return await this.citaRepository.save(cita);
  }

  async findAll(): Promise<Cita[]> {
    return await this.citaRepository.find();
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findOne({ where: { id } });
    if (!cita) {
      throw new NotFoundException(`Cita con ID ${id} no encontrado`);
    }
    return cita;
  }

  async update(id: number, updateCitaInput: UpdateCitaInput): Promise<Cita> {
    const cita = await this.findOne(id); // Verifica que existe
    Object.assign(cita, updateCitaInput);
    return await this.citaRepository.save(cita);
  }

  async remove(id: number): Promise<Cita> {
    const result = await this.citaRepository.findOneBy({ id });

    if (!result) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }

    await this.citaRepository.remove(result)
    return result;

  }

}
