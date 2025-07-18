// create-cita.input.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsDateString } from 'class-validator';

@InputType({ description: 'Datos para crear una nueva cita médica' })
export class CreateCitaInput {
  @Field(() => ID, { description: 'ID del médico asignado a la cita' })
  medicoId: number;

  @Field(() => ID, { description: 'ID del paciente que solicita la cita' })
  pacienteId: number;

  @Field({ description: 'Motivo o razón de la cita' })
  @IsString()
  razon: string;

  @Field({ description: 'Fecha en la que se realizará la cita' })
  @IsDateString()
  fecha: Date;

  @Field({ description: 'Hora de la cita en formato HH:mm' })
  @IsString() // Se recomienda un validador personalizado para el formato
  hora: string;
}
