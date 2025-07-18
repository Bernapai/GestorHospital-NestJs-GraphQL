// paciente.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';

@ObjectType({ description: 'Representa un paciente asociado a un usuario' })
@Entity()
export class Paciente {
  @Field(() => ID, { description: 'Identificador único del paciente' })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.paciente)
  @JoinColumn()
  usuario: Usuario;

  @Field({ description: 'Nombre completo del paciente' })
  @Column()
  nombre: string;

  @Field({ description: 'Documento Nacional de Identidad del paciente' })
  @Column()
  dni: string;

  @Field({ nullable: true, description: 'Fecha de nacimiento del paciente' })
  @Column({ nullable: true })
  fechaNacimiento?: Date;

  @Field({ nullable: true, description: 'Número de teléfono del paciente' })
  @Column({ nullable: true })
  telefono?: string;
}
