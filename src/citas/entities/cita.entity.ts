import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';

@ObjectType({ description: 'Representa una cita médica' })
@Entity()
export class Cita {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Medico)
  @ManyToOne(() => Medico, (medico) => medico.citas)
  @JoinColumn()
  medico: Medico;

  @Field(() => Paciente)
  @ManyToOne(() => Paciente, (paciente) => paciente.citas)
  @JoinColumn()
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