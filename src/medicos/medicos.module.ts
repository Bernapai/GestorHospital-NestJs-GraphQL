import { Module } from '@nestjs/common';
import { MedicosService } from './services/medicos.service';
import { MedicosResolver } from './resolver/medicos.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AppCacheModule } from 'src/cache/cache.module';
import { UsersModule } from 'src/users/users.module';
import { CitasModule } from 'src/citas/citas.module';
import { forwardRef } from '@nestjs/common';


@Module({
  imports: [
    TypeOrmModule.forFeature([Medico]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => CitasModule),
    AppCacheModule
  ],
  providers: [MedicosResolver, MedicosService],
  exports: [MedicosService] // Exporta si otros módulos necesitan el servicio
})
export class MedicosModule { }