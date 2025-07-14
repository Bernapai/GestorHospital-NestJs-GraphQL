import { Module } from '@nestjs/common';
import { CitasService } from './services/citas.service';
import { CitasResolver } from './resolvers/citas.resolver';

@Module({
  providers: [CitasResolver, CitasService],
})
export class CitasModule { }
