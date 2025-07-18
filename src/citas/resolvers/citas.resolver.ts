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
  @Query(() => [Cita], {
    name: 'citas',
    description: 'Devuelve todas las citas registradas. Solo accesible por médicos.',
  })
  findAll(): Promise<Cita[]> {
    return this.citasService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Cita, {
    name: 'cita',
    description: 'Devuelve una cita específica por ID. Solo accesible por médicos.',
  })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Cita> {
    return this.citasService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO, RolUsuario.PACIENTE)
  @Mutation(() => Cita, {
    description: 'Crea una nueva cita. Pueden hacerlo tanto médicos como pacientes.',
  })
  createCita(
    @Args('createCitaInput') createCitaInput: CreateCitaInput,
  ): Promise<Cita> {
    return this.citasService.create(createCitaInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Cita, {
    description: 'Actualiza una cita existente. Solo accesible por médicos.',
  })
  updateCita(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCitaInput') updateCitaInput: UpdateCitaInput,
  ): Promise<Cita> {
    return this.citasService.update(id, updateCitaInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Cita, {
    description: 'Elimina una cita por su ID. Solo accesible por médicos.',
  })
  removeCita(@Args('id', { type: () => Int }) id: number): Promise<Cita> {
    return this.citasService.remove(id);
  }
}
