import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicosService } from '../services/medicos.service';
import { Medico } from '../entities/medico.entity';
import { CreateMedicoInput } from '../dto/create-medico.input';
import { UpdateMedicoInput } from '../dto/update-medico.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolUsuario } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';


@Injectable()
@Resolver(() => Medico)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.MEDICO)
export class MedicosResolver {
  constructor(private readonly medicosService: MedicosService) { }

  @Query(() => [Medico], {
    name: 'medicos',
    description: 'Obtiene la lista completa de médicos (solo para médicos autenticados)',
  })
  findAll(): Promise<Medico[]> {
    return this.medicosService.findAll();
  }

  @Query(() => Medico, {
    name: 'medico',
    description: 'Obtiene un médico por su ID (solo para médicos autenticados)',
  })
  findOne(
    @Args('id', { type: () => Int, description: 'ID del médico a buscar' }) id: number,
  ): Promise<Medico> {
    return this.medicosService.findOne(id);
  }

  @Mutation(() => Medico, {
    description: 'Crea un nuevo médico en el sistema (solo para médicos autenticados)',
  })
  createMedico(
    @Args('createMedicoInput', { description: 'Datos para crear un médico' }) createMedicoInput: CreateMedicoInput,
  ): Promise<Medico> {
    return this.medicosService.create(createMedicoInput);
  }

  @Mutation(() => Medico, {
    description: 'Actualiza un médico existente (solo para médicos autenticados)',
  })
  updateMedico(
    @Args('id', { type: () => Int, description: 'ID del médico a actualizar' }) id: number,
    @Args('updateMedicoInput', { description: 'Datos para actualizar el médico' }) updateMedicoInput: UpdateMedicoInput,
  ): Promise<Medico> {
    return this.medicosService.update(id, updateMedicoInput);
  }

  @Mutation(() => Medico, {
    description: 'Elimina un médico por su ID (solo para médicos autenticados)',
  })
  removeMedico(
    @Args('id', { type: () => Int, description: 'ID del médico a eliminar' }) id: number,
  ) {
    return this.medicosService.remove(id);
  }
}
