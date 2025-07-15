import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicosService } from '../services/medicos.service';
import { Medico } from '../entities/medico.entity';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';

@Resolver(() => Medico)
export class MedicosResolver {
  constructor(private readonly medicosService: MedicosService) { }


}
