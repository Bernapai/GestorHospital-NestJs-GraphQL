import { Injectable } from '@nestjs/common';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';

@Injectable()
export class PacientesService {
  create(createPacienteInput: CreatePacienteInput) {
    return 'This action adds a new paciente';
  }

  findAll() {
    return `This action returns all pacientes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paciente`;
  }

  update(id: number, updatePacienteInput: UpdatePacienteInput) {
    return `This action updates a #${id} paciente`;
  }

  remove(id: number) {
    return `This action removes a #${id} paciente`;
  }
}
