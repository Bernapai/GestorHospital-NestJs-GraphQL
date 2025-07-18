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
  @Query(() => [Usuario], { name: 'usuarios' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Query(() => Usuario, { name: 'usuario' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }


  @Mutation(() => Usuario)
  createUsuario(@Args('createUsuarioInput') createUsuarioInput: CreateUserInput) {
    return this.usersService.create(createUsuarioInput);
  }


  @Mutation(() => Usuario)
  updateUsuario(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateUsuarioInput') updateUsuarioInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUsuarioInput);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RolUsuario.MEDICO)
  @Mutation(() => Usuario)
  removeUsuario(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
