import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersResolver } from './resolvers/users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() => AuthModule)],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule { }
