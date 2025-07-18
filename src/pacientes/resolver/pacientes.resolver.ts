import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../entities/paciente.entity';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolUsuario } from 'src/users/entities/user.entity';


@Resolver(() => Paciente)
export class PacientesResolver {
  constructor(private readonly pacientesService: PacientesService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => [Paciente], { name: 'pacientes' })
  findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Paciente, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Paciente> {
    return this.pacientesService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.PACIENTE)
  @Mutation(() => Paciente)
  createPaciente(
    @Args('createPacienteInput') createPacienteInput: CreatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.create(createPacienteInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO, RolUsuario.PACIENTE)
  @Mutation(() => Paciente)
  updatePaciente(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePacienteInput') updatePacienteInput: UpdatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.update(id, updatePacienteInput);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Paciente)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.pacientesService.remove(id);
  }


}