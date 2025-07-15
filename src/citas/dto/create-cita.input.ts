// dto/create-cita.dto.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsDateString } from 'class-validator';

@InputType()
export class CreateCitaInput {
  @Field(() => ID)
  medicoId: number;

  @Field(() => ID)
  pacienteId: number;

  @Field()
  @IsString()
  razon: string;

  @Field()
  @IsDateString()
  fecha: Date;

  @Field()
  @IsString() // podés usar un custom validator para formato HH:mm
  hora: string;
}
