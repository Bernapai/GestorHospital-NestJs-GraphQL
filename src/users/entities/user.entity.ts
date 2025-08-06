import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

export enum RolUsuario {
  MEDICO = 'medico',
  PACIENTE = 'paciente',
}

registerEnumType(RolUsuario, {
  name: 'RolUsuario',
});

@ObjectType({ description: 'Representa un usuario del sistema' })
@Entity()
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  password: string;

  @Field(() => RolUsuario)
  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  @Field(() => Medico, { nullable: true })
  @OneToOne(() => Medico, (medico) => medico.usuario, { nullable: true })
  medico?: Medico;

  @Field(() => Paciente, { nullable: true })
  @OneToOne(() => Paciente, (paciente) => paciente.usuario, { nullable: true })
  paciente?: Paciente;
}