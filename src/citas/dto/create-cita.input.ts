import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCitaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
