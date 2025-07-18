// medico.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';

@ObjectType({ description: 'Representa un médico asociado a un usuario' })
@Entity()
export class Medico {
  @Field(() => ID, { description: 'Identificador único del médico' })
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.medico)
  @JoinColumn()
  usuario: Usuario;

  @Field({ description: 'Especialidad médica del profesional' })
  @Column()
  especialidad: string;

  @Field({ description: 'Nombre completo del médico' })
  @Column()
  nombre: string;

  @Field({ description: 'Dirección física del consultorio o lugar de trabajo' })
  @Column()
  direccion: string;

  @Field({ nullable: true, description: 'Número de teléfono de contacto' })
  @Column({ nullable: true })
  telefono?: string;
}
