import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../entities/paciente.entity';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';

@Resolver(() => Paciente)
export class PacientesResolver {
  constructor(private readonly pacientesService: PacientesService) { }


}
