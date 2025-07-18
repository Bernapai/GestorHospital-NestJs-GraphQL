// create-paciente.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType({ description: 'Datos para crear un nuevo paciente' })
export class CreatePacienteInput {
  @Field(() => ID, { description: 'ID del usuario asociado al paciente' })
  usuarioId: number;

  @Field({ description: 'Nombre completo del paciente' })
  @IsString()
  nombre: string;

  @Field({ description: 'Documento Nacional de Identidad del paciente' })
  @IsString()
  dni: string;

  @Field({ nullable: true, description: 'Fecha de nacimiento del paciente' })
  @IsOptional()
  fechaNacimiento?: Date;

  @Field({ nullable: true, description: 'Número de teléfono del paciente' })
  @IsOptional()
  @IsString()
  telefono?: string;
}
