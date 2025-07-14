import { Module } from '@nestjs/common';
import { MedicosService } from './services/medicos.service';
import { MedicosResolver } from './resolver/medicos.resolver';

@Module({
  providers: [MedicosResolver, MedicosService],
})
export class MedicosModule { }
