import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';
import { Medico } from '../entities/medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>
  ) { }

  async create(createMedicoInput: CreateMedicoInput): Promise<Medico> {
    const medico = this.medicoRepository.create(createMedicoInput)
    return await this.medicoRepository.save(medico)
  }

  async findAll(): Promise<Medico[]> {
    return await this.medicoRepository.find();
  }

  async findOne(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findOne({ where: { id } });
    if (!medico) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
    return medico;
  }

  async update(id: number, updateMedicoInput: UpdateMedicoInput): Promise<Medico> {
    const medico = await this.findOne(id); // Verifica que existe
    Object.assign(medico, updateMedicoInput);
    return await this.medicoRepository.save(medico);
  }

  async remove(id: number): Promise<Medico> {
    const result = await this.medicoRepository.findOneBy({ id });

    if (!result) {
      throw new NotFoundException(`Medico con id ${id} no encontrado`);
    }

    await this.medicoRepository.remove(result)
    return result;

  }
}
