import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Medico {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
