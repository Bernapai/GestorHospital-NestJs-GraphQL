import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';
import { Paciente } from '../entities/paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) { }

  async create(createPacienteInput: CreatePacienteInput): Promise<Paciente> {
    const paciente = this.pacienteRepository.create(createPacienteInput);
    return await this.pacienteRepository.save(paciente);
  }

  async findAll(): Promise<Paciente[]> {
    return await this.pacienteRepository.find();
  }

  async findOne(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({ where: { id } });
    if (!paciente) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return paciente;
  }

  async update(id: number, updatePacienteInput: UpdatePacienteInput): Promise<Paciente> {
    const paciente = await this.findOne(id); // Verifica que existe
    Object.assign(paciente, updatePacienteInput);
    return await this.pacienteRepository.save(paciente);
  }

  async remove(id: number): Promise<Paciente> {
    const result = await this.pacienteRepository.findOneBy({ id });

    if (!result) {
      throw new NotFoundException(`Paciente con id ${id} no encontrado`);
    }

    await this.pacienteRepository.remove(result)
    return result;

  }
}