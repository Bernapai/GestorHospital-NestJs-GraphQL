import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/cita.entity';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(private readonly citasService: CitasService) { }

  @Mutation(() => Cita)
  createCita(@Args('createCitaInput') createCitaInput: CreateCitaInput) {
    return this.citasService.create(createCitaInput);
  }

  @Query(() => [Cita], { name: 'citas' })
  findAll() {
    return this.citasService.findAll();
  }

  @Query(() => Cita, { name: 'cita' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.citasService.findOne(id);
  }

  @Mutation(() => Cita)
  updateCita(@Args('updateCitaInput') updateCitaInput: UpdateCitaInput) {
    return this.citasService.update(updateCitaInput.id, updateCitaInput);
  }

  @Mutation(() => Cita)
  removeCita(@Args('id', { type: () => Int }) id: number) {
    return this.citasService.remove(id);
  }
}
