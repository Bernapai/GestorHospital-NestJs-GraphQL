// cita.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

@ObjectType({ description: 'Representa una cita médica entre un paciente y un médico' })
@Entity()
export class Cita {
  @Field(() => ID, { description: 'Identificador único de la cita' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Medico)
  @Field(() => Medico, { description: 'Médico asignado a la cita' })
  medico: Medico;

  @ManyToOne(() => Paciente)
  @Field(() => Paciente, { description: 'Paciente que solicita la cita' })
  paciente: Paciente;

  @Field({ description: 'Motivo o razón de la cita' })
  @Column()
  razon: string;

  @Field({ description: 'Fecha en que se realizará la cita' })
  @Column({ type: 'date' })
  fecha: Date;

  @Field({ description: 'Hora a la que está programada la cita (formato HH:mm)' })
  @Column({ type: 'time' })
  hora: string;
}
