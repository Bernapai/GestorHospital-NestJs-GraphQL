import { CreatePacienteInput } from './create-paciente.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePacienteInput extends PartialType(CreatePacienteInput) {
  @Field(() => Int)
  id: number;
}
