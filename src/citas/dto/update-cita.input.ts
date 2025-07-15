import { CreateCitaInput } from './create-cita.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCitaInput extends PartialType(CreateCitaInput) { }
