// create-medico.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType({ description: 'Datos para crear un nuevo médico' })
export class CreateMedicoInput {
  @Field(() => ID, { description: 'ID del usuario asociado al médico' })
  usuarioId: number;

  @Field({ description: 'Nombre completo del médico' })
  @IsString()
  nombre: string;

  @Field({ description: 'Especialidad médica del profesional' })
  @IsString()
  especialidad: string;

  @Field({ description: 'Dirección física del consultorio o lugar de trabajo' })
  @IsString()
  direccion: string;

  @Field({ nullable: true, description: 'Número de teléfono de contacto' })
  @IsOptional()
  @IsString()
  telefono?: string;
}
