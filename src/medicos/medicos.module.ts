import { Module } from '@nestjs/common';
import { MedicosService } from './services/medicos.service';
import { MedicosResolver } from './resolver/medicos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  providers: [MedicosResolver, MedicosService],
})
export class MedicosModule { }
