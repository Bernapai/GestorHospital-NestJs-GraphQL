import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';
import { Cita } from 'src/citas/entities/cita.entity';

@ObjectType({ description: 'Representa un paciente asociado a un usuario' })
@Entity()
export class Paciente {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Usuario)
  @OneToOne(() => Usuario, (usuario) => usuario.paciente)
  @JoinColumn()
  usuario: Usuario;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  dni: string;

  // AÑADIR @Field A CITAS!
  @Field(() => [Cita], { nullable: true })
  @OneToMany(() => Cita, (cita) => cita.paciente)
  citas: Cita[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  fechaNacimiento?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;
}