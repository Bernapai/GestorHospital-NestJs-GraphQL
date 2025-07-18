import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CitasService } from '../services/citas.service';
import { Cita } from '../entities/cita.entity';
import { CreateCitaInput } from '../dto/create-cita.input';
import { UpdateCitaInput } from '../dto/update-cita.input';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolUsuario } from 'src/users/entities/user.entity';

@Resolver(() => Cita)
export class CitasResolver {
  constructor(private readonly citasService: CitasService) { }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => [Cita], { name: 'pacientes' })
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Cita, { name: 'paciente' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO, RolUsuario.PACIENTE)
  @Mutation(() => Cita)
  createCita(
    @Args('createCitaInput') createCitaInput: CreateCitaInput,
  ): Promise<Cita> {
    return this.citasService.create(createCitaInput);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Cita)
  updateCita(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePacienteInput') updateCitaInput: UpdateCitaInput,
  ): Promise<Cita> {
    return this.citasService.update(id, updateCitaInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Cita)
  removeCita(@Args('id', { type: () => Int }) id: number) {
    return this.citasService.remove(id);
  }


}
