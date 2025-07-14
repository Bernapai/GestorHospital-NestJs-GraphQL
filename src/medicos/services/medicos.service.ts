import { Injectable } from '@nestjs/common';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';

@Injectable()
export class MedicosService {
  create(createMedicoInput: CreateMedicoInput) {
    return 'This action adds a new medico';
  }

  findAll() {
    return `This action returns all medicos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medico`;
  }

  update(id: number, updateMedicoInput: UpdateMedicoInput) {
    return `This action updates a #${id} medico`;
  }

  remove(id: number) {
    return `This action removes a #${id} medico`;
  }
}
