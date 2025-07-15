import { Module } from '@nestjs/common';
import { CitasService } from './services/citas.service';
import { CitasResolver } from './resolvers/citas.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './entities/cita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita])],
  providers: [CitasResolver, CitasService],
})
export class CitasModule { }
