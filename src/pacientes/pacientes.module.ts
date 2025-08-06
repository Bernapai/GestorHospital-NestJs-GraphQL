import { Module, forwardRef } from '@nestjs/common';
import { PacientesService } from './services/pacientes.service';
import { PacientesResolver } from './resolver/pacientes.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';
import { UsersModule } from 'src/users/users.module';
import { CitasModule } from 'src/citas/citas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Paciente]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CitasModule),
    AppCacheModule
  ],
  providers: [PacientesResolver, PacientesService],
  exports: [PacientesService] // Exporta si otros módulos necesitan el servicio
})
export class PacientesModule { }