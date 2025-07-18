import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { RolUsuario, Usuario } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Usuario)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => [Usuario], {
    name: 'usuarios',
    description: 'Obtiene la lista completa de usuarios (solo para médicos)',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Usuario, {
    name: 'usuario',
    description: 'Obtiene un usuario por su ID (solo para médicos)',
  })
  findOne(@Args('id', { type: () => Int, description: 'ID del usuario a buscar' }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => Usuario, {
    description: 'Crea un nuevo usuario en el sistema',
  })
  createUsuario(
    @Args('createUsuarioInput', { description: 'Datos para crear un usuario' }) createUsuarioInput: CreateUserInput,
  ) {
    return this.usersService.create(createUsuarioInput);
  }

  @Mutation(() => Usuario, {
    description: 'Actualiza los datos de un usuario existente',
  })
  updateUsuario(
    @Args('id', { type: () => Int, description: 'ID del usuario a actualizar' }) id: number,
    @Args('updateUsuarioInput', { description: 'Datos para actualizar el usuario' }) updateUsuarioInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUsuarioInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Usuario, {
    description: 'Elimina un usuario del sistema por su ID (solo para médicos)',
  })
  removeUsuario(@Args('id', { type: () => Int, description: 'ID del usuario a eliminar' }) id: number) {
    return this.usersService.remove(id);
  }
}
