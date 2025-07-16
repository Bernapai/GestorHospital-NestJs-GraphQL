import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicosService } from '../services/medicos.service';
import { Medico } from '../entities/medico.entity';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';

@Resolver(() => Medico)
export class MedicosResolver {
  constructor(private readonly medicosService: MedicosService) { }

  @Query(() => [Medico], { name: 'pacientes' })
  findAll(): Promise<Medico[]> {
    return this.medicosService.findAll();
  }

  @Query(() => Medico, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Medico> {
    return this.medicosService.findOne(id);
  }

  @Mutation(() => Medico)
  createPaciente(
    @Args('createPacienteInput') createMedicoInput: CreateMedicoInput,
  ): Promise<Medico> {
    return this.medicosService.create(createMedicoInput);
  }

  @Mutation(() => Medico)
  updatePaciente(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePacienteInput') updateMedicoInput: UpdateMedicoInput,
  ): Promise<Medico> {
    return this.medicosService.update(id, updateMedicoInput);
  }

  @Mutation(() => Medico)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.medicosService.remove(id);
  }


}
