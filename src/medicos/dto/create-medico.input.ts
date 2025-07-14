import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMedicoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
