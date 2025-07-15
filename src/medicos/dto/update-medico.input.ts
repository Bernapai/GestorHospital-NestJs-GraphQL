import { CreateMedicoInput } from './create-medico.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicoInput extends PartialType(CreateMedicoInput) { }
