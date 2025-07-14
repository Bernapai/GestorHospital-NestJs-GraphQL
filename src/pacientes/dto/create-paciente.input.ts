import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePacienteInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
