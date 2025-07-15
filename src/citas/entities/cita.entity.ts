// cita.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@ObjectType()
@Entity()
export class Cita {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medico)
  @Field(() => Medico)
  medico: Medico;

  @ManyToOne(() => Paciente)
  @Field(() => Paciente)
  paciente: Paciente;

  @Field()
  @Column()
  razon: string;

  @Field()
  @Column({ type: 'date' })
  fecha: Date;

  @Field()
  @Column({ type: 'time' })
  hora: string;
}
