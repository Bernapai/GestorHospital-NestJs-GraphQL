import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../entities/paciente.entity';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';

@Resolver(() => Paciente)
export class PacientesResolver {
  constructor(private readonly pacientesService: PacientesService) { }

  @Query(() => [Paciente], { name: 'pacientes' })
  findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  @Query(() => Paciente, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Paciente> {
    return this.pacientesService.findOne(id);
  }

  @Mutation(() => Paciente)
  createPaciente(
    @Args('createPacienteInput') createPacienteInput: CreatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.create(createPacienteInput);
  }

  @Mutation(() => Paciente)
  updatePaciente(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePacienteInput') updatePacienteInput: UpdatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.update(id, updatePacienteInput);
  }

  @Mutation(() => Paciente)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.pacientesService.remove(id);
  }


}