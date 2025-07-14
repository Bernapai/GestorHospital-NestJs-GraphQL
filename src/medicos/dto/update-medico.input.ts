import { CreateMedicoInput } from './create-medico.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicoInput extends PartialType(CreateMedicoInput) {
  @Field(() => Int)
  id: number;
}
