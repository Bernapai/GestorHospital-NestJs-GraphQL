
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
  description: 'Rol del usuario dentro del sistema',
});

@ObjectType({ description: 'Representa un usuario del sistema' })
@Entity()
export class Usuario {
  @Field(() => ID, { description: 'Identificador único del usuario' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Correo electrónico único del usuario' })
  @Column({ unique: true })
  email: string;

  @Field({ description: 'Contraseña del usuario' })
  @Column()
  password: string;

  @Field(() => RolUsuario, { description: 'Rol asignado al usuario (médico o paciente)' })
  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  // Relación con Medico
  @OneToOne(() => Medico, (medico) => medico.usuario)
  medico?: Medico;

  // Relación con Paciente
  @OneToOne(() => Paciente, (paciente) => paciente.usuario)
  paciente?: Paciente;
}