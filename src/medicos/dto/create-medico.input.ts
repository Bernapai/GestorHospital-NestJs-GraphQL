// dto/create-medico.dto.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateMedicoInput {
  @Field(() => ID)
  usuarioId: number;

  @Field()
  @IsString()
  nombre: string;

  @Field()
  @IsString()
  especialidad: string;

  @Field()
  @IsString()
  direccion: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;
}