import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/cita.entity';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(private readonly citasService: CitasService) { }
  @Query(() => [Cita], { name: 'pacientes' })
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @Query(() => Cita, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @Mutation(() => Cita)
  createPaciente(
    @Args('createPacienteInput') createCitaInput: CreateCitaInput,
  ): Promise<Cita> {
    return this.citasService.create(createCitaInput);
  }

  @Mutation(() => Cita)
  updatePaciente(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePacienteInput') updateCitaInput: UpdateCitaInput,
  ): Promise<Cita> {
    return this.citasService.update(id, updateCitaInput);
  }

  @Mutation(() => Cita)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.citasService.remove(id);
  }


}
