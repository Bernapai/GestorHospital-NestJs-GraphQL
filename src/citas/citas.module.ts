import { Module } from '@nestjs/common';
import { CitasService } from './services/citas.service';
import { CitasResolver } from './resolvers/citas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cita]), AuthModule],
  providers: [CitasResolver, CitasService],
})
export class CitasModule { }
