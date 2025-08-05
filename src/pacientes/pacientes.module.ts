import { Module } from '@nestjs/common';
import { PacientesService } from './services/pacientes.service';
import { PacientesResolver } from './resolver/pacientes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente]), AuthModule, AppCacheModule],
  providers: [PacientesResolver, PacientesService],
})
export class PacientesModule { }
