import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../entities/paciente.entity';
import { CreatePacienteInput } from '../dto/create-paciente.input';
import { UpdatePacienteInput } from '../dto/update-paciente.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolUsuario } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';


@Injectable()
@Resolver(() => Paciente)
export class PacientesResolver {
  constructor(private readonly pacientesService: PacientesService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => [Paciente], {
    name: 'pacientes',
    description: 'Devuelve la lista completa de pacientes. Solo accesible por médicos.'
  })
  findAll(): Promise<Paciente[]> {
    return this.pacientesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Paciente, {
    name: 'paciente',
    description: 'Busca un paciente por ID. Solo accesible por médicos.'
  })
  findOne(@Args('id', { type: () => Int, description: 'ID del paciente' }) id: number): Promise<Paciente> {
    return this.pacientesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.PACIENTE)
  @Mutation(() => Paciente, {
    description: 'Permite que un paciente cree su perfil. Solo accesible por pacientes.'
  })
  createPaciente(
    @Args('createPacienteInput', { description: 'Datos del paciente a crear' }) createPacienteInput: CreatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.create(createPacienteInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO, RolUsuario.PACIENTE)
  @Mutation(() => Paciente, {
    description: 'Actualiza los datos de un paciente. Médicos y pacientes pueden acceder.'
  })
  updatePaciente(
    @Args('id', { type: () => Int, description: 'ID del paciente a actualizar' }) id: number,
    @Args('updatePacienteInput', { description: 'Nuevos datos del paciente' }) updatePacienteInput: UpdatePacienteInput,
  ): Promise<Paciente> {
    return this.pacientesService.update(id, updatePacienteInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Paciente, {
    description: 'Elimina un paciente por ID. Solo accesible por médicos.'
  })
  removeUsuario(@Args('id', { type: () => Int, description: 'ID del paciente a eliminar' }) id: number) {
    return this.pacientesService.remove(id);
  }
}
