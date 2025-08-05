import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PacientesModule } from './pacientes/pacientes.module';
import { ConfigModule } from '@nestjs/config';
import { CitasModule } from './citas/citas.module';
import { MedicosModule } from './medicos/medicos.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AppCacheModule } from './cache/cache.module';
import { HealthModule } from './health/health.module';
import { throttlerConfig } from './config/throttler.config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      debug: true,
      introspection: true,
      sortSchema: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    ThrottlerModule.forRoot(throttlerConfig),
    PacientesModule,
    CitasModule,
    MedicosModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    AppCacheModule,
    HealthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
