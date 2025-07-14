import { Injectable } from '@nestjs/common';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';

@Injectable()
export class CitasService {
  create(createCitaInput: CreateCitaInput) {
    return 'This action adds a new cita';
  }

  findAll() {
    return `This action returns all citas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cita`;
  }

  update(id: number, updateCitaInput: UpdateCitaInput) {
    return `This action updates a #${id} cita`;
  }

  remove(id: number) {
    return `This action removes a #${id} cita`;
  }
}
