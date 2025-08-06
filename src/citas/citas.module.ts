import { Module, forwardRef } from '@nestjs/common';
import { CitasService } from './services/citas.service';
import { CitasResolver } from './resolvers/citas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';
import { MedicosModule } from 'src/medicos/medicos.module';
import { PacientesModule } from 'src/pacientes/pacientes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    forwardRef(() => AuthModule),
    forwardRef(() => MedicosModule),
    forwardRef(() => PacientesModule),
    AppCacheModule
  ],
  providers: [CitasResolver, CitasService]
})
export class CitasModule { }