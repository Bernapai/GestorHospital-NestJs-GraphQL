import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/cita.entity';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(private readonly citasService: CitasService) { }


}
