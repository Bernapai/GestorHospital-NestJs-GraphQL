import { CreateCitaInput } from './create-cita.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCitaInput extends PartialType(CreateCitaInput) {
  @Field(() => Int)
  id: number;
}
