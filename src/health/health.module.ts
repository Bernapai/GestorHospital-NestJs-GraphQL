import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthResolver } from './health.resolver';

@Module({
    imports: [TerminusModule],
    controllers: [HealthResolver],
})
export class HealthModule { }