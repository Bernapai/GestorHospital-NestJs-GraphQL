import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, forwardRef } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { throttlerConfig } from './config/throttler.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MedicosModule } from './medicos/medicos.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { CitasModule } from './citas/citas.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    // Configuración base primero
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './env',
    }),
    DatabaseModule,
    HealthModule,
    ThrottlerModule.forRoot(throttlerConfig),
    AppCacheModule,

    // Módulos de entidades con forwardRef para manejar relaciones circulares
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MedicosModule),
    forwardRef(() => PacientesModule),
    forwardRef(() => CitasModule),

    // Configuración GraphQL (debe ir después de los módulos de entidades)
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql', // Nombre explícito para mejor debugging
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
        orphanedTypes: [],
      },
      context: ({ req }) => ({ req }),
      playground: true,
      debug: process.env.NODE_ENV !== 'production',
      introspection: true,
      sortSchema: true,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }