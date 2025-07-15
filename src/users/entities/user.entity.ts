// usuario.entity.ts
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Medico } from 'src/medicos/entities/medico.entity';
import { Paciente } from 'src/pacientes/entities/paciente.entity';

export enum RolUsuario {
  MEDICO = 'medico',
  PACIENTE = 'paciente',
}

registerEnumType(RolUsuario, {
  name: 'RolUsuario',
});

@ObjectType()
@Entity()
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => RolUsuario)
  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  // Relación con Medico
  @OneToOne(() => Medico, (medico) => medico.usuario)
  medico?: Medico;

  // Relación con Paciente
  @OneToOne(() => Paciente, (paciente) => paciente.usuario)
  paciente?: Paciente;
}
