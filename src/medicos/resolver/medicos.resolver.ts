import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicosService } from '../services/medicos.service';
import { Medico } from '../entities/medico.entity';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';

@Resolver(() => Medico)
export class MedicosResolver {
  constructor(private readonly medicosService: MedicosService) { }

  @Mutation(() => Medico)
  createMedico(@Args('createMedicoInput') createMedicoInput: CreateMedicoInput) {
    return this.medicosService.create(createMedicoInput);
  }

  @Query(() => [Medico], { name: 'medicos' })
  findAll() {
    return this.medicosService.findAll();
  }

  @Query(() => Medico, { name: 'medico' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.medicosService.findOne(id);
  }

  @Mutation(() => Medico)
  updateMedico(@Args('updateMedicoInput') updateMedicoInput: UpdateMedicoInput) {
    return this.medicosService.update(updateMedicoInput.id, updateMedicoInput);
  }

  @Mutation(() => Medico)
  removeMedico(@Args('id', { type: () => Int }) id: number) {
    return this.medicosService.remove(id);
  }
}
