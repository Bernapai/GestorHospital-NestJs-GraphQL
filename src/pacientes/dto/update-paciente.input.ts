import { CreatePacienteInput } from './create-paciente.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePacienteInput extends PartialType(CreatePacienteInput) {


}
