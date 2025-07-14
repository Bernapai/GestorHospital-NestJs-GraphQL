import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../entities/paciente.entity';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';

@Resolver(() => Paciente)
export class PacientesResolver {
  constructor(private readonly pacientesService: PacientesService) { }

  @Mutation(() => Paciente)
  createPaciente(@Args('createPacienteInput') createPacienteInput: CreatePacienteInput) {
    return this.pacientesService.create(createPacienteInput);
  }

  @Query(() => [Paciente], { name: 'pacientes' })
  findAll() {
    return this.pacientesService.findAll();
  }

  @Query(() => Paciente, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.pacientesService.findOne(id);
  }

  @Mutation(() => Paciente)
  updatePaciente(@Args('updatePacienteInput') updatePacienteInput: UpdatePacienteInput) {
    return this.pacientesService.update(updatePacienteInput.id, updatePacienteInput);
  }

  @Mutation(() => Paciente)
  removePaciente(@Args('id', { type: () => Int }) id: number) {
    return this.pacientesService.remove(id);
  }
}
