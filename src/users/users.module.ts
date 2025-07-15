import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule { }
