import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PacientesModule } from './pacientes/pacientes.module';
import { ConfigModule } from '@nestjs/config';
import { CitasModule } from './citas/citas.module';
import { MedicosModule } from './medicos/medicos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    PacientesModule,
    CitasModule,
    MedicosModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
