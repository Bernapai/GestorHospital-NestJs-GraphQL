import { Module } from '@nestjs/common';
import { MedicosService } from './services/medicos.service';
import { MedicosResolver } from './resolver/medicos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Medico]), AuthModule],
  providers: [MedicosResolver, MedicosService],
})
export class MedicosModule { }
