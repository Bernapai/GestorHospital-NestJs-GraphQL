import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Cita {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
