// dto/create-paciente.dto.ts
import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class CreatePacienteInput {
  @Field(() => ID)
  usuarioId: number;

  @Field()
  @IsString()
  nombre: string;

  @Field()
  @IsString()
  dni: string;

  @Field({ nullable: true })
  @IsOptional()
  fechaNacimiento?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  telefono?: string;
}
