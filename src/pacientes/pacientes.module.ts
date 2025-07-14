import { Module } from '@nestjs/common';
import { PacientesService } from './services/pacientes.service';
import { PacientesResolver } from './resolver/pacientes.resolver';

@Module({
  providers: [PacientesResolver, PacientesService],
})
export class PacientesModule { }
