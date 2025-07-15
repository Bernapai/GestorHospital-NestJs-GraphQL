import { Module } from '@nestjs/common';
import { PacientesService } from './services/pacientes.service';
import { PacientesResolver } from './resolver/pacientes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  providers: [PacientesResolver, PacientesService],
})
export class PacientesModule { }
